import Web3 from 'web3';
import starTokenArtifact from "../../build/contracts/StarToken.json";

const App = {
    web: null,
    account: null,
    meta: null,

    start: async function () {
        const { web3 } = this;

        try {
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = starTokenArtifact.networks[networkId];
            this.meta = new web3.eth.Contract(
                starTokenArtifact.abi,
                deployedNetwork.address,
            );

            const accounts = await web3.eth.getAccounts();
            this.account = accounts[0];

            this.refreshBalance();
        } catch(error) {
            console.error("Could not connect to contract or chain");
        }
    },

    setStatus: function(message) {
        const status = document.getElementById("status");
        status.innerHTML = message;
    },

    createStar: async function () {
        const { createStar } = this.meta.methods;
        const name = document.getElementById("starName").value;
        const date = document.getElementById("starDate").value;
        const id = document.getElementById("starId").value;
        await createStar(name, date, id).send({from: this.account});
        App.setStatus("New Star Owner is " + this.account + " [" + date + "]." )
    },

    lookupStar: async function () {
        const { lookUpTokenIdToStarInfo } = this.meta.methods;
        const id = document.getElementById("lookupId").value;
        const {name, date} = await lookUpTokenIdToStarInfo(id).call();
        App.setStatus("Star Name is " + name + "[" + date + "].");
    }
};

window.App = App;

window.addEventListener("load", function() {
    if (window.ethereum) {
        App.web3 = new Web3(window.ethereum)
        window.ethereum.enable();
    } else {
        console.warn(
            "No web3 detected. Falling back to ganache. You should remove this fallback when deployed production",
        );

        App.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));
    }

    App.start();
})