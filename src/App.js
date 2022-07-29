import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import { useState, useEffect } from "react";

import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import BigNumber from "bignumber.js";
import IERC from "./contract/IERC.abi.json";
import artifact from "./contract/artifact.abi.json";
import NewArtifacts from "./components/NewArtifacts";
import Artifacts from "./components/Artifacts";

const ERC20_DECIMALS = 18;

const contractAddress = "0x1eE84b939e37d95451616A1346AF5F5297f9BDEE";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";

function App() {
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [artifacts, setArtifacts] = useState([]);

  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      console.log("Error Occurred");
    }
  };

  const getBalance = async () => {
    try {
      const balance = await kit.getTotalBalance(address);
      const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);
      const contract = new kit.web3.eth.Contract(artifact, contractAddress);
      setcontract(contract);
      setcUSDBalance(USDBalance);
    } catch (error) {
      console.log(error);
    }
  };

  const getArtifact = async () => {
    const artifactsLength = await contract.methods.getartifactsLength().call();
    const _artifactt = [];
    for (let index = 0; index < artifactsLength; index++) {
      let _artifacts = new Promise(async (resolve, reject) => {
        let artifact = await contract.methods.getArtifact(index).call();

        resolve({
          index: index,
          owner: artifact[0],
          image: artifact[1],
          name: artifact[2],
          description: artifact[3],
          price: artifact[4],
        });
      });
      _artifactt.push(_artifacts);
    }
    const _artifacts = await Promise.all(_artifactt);
    setArtifacts(_artifacts);
  };

  useEffect(() => {
    connectToWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      getBalance();
    }
  }, [kit, address]);

  useEffect(() => {
    if (contract) {
      getArtifact();
    }
  }, [contract]);

  const ReformArtifactImage = async (_index, _newAge) => {
    console.log(_index);
    try {
      await contract.methods
        .ReformArtifactImage(_index, _newAge)
        .send({ from: address });
      getArtifact();
      getBalance();
    } catch (error) {
      console.log(error);
      alert("The Artifact image has succesfully been changed");
    }
  };

  const addArtifact = async (_image, _name, _description, price) => {
    const _price = new BigNumber(price).shiftedBy(ERC20_DECIMALS).toString();
    try {
      await contract.methods
        .addArtifact(_image, _name, _description, _price)
        .send({ from: address });
      getArtifact();
    } catch (error) {
      console.log(error);
    }
  };

  const buyArtifact = async (_index) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(IERC, cUSDContractAddress);

      await cUSDContract.methods
        .approve(contractAddress, artifacts[_index].price)
        .send({ from: address });
      await contract.methods.buyArtifact(_index).send({ from: address });
      getArtifact();
      getBalance();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Navbar balance={cUSDBalance} />
      <Artifacts
        artifacts={artifacts}
        buyArtifact={buyArtifact}
        ReformArtifactImage={ReformArtifactImage}
        onlyOwner={address}
      />
      <NewArtifacts addArtifact={addArtifact} />
    </div>
  );
}

export default App;
