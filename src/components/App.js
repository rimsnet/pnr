import React, { Component } from 'react';
import Web3 from 'web3'
import logo from '../logo.png';
import './App.css';
import CovidTraker from '../abis/CovidTraker.json'
import Navbar from './Navbar'
import Main from './Main'

class App extends Component {

  async componentWillMount() {
    try{
      await this.loadWeb3()
      await this.loadBlockchainData()
    }catch(error){
      alert ("Please add MetaMask extention");
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    const networkId = await web3.eth.net.getId()
    const networkData = CovidTraker.networks[networkId]
    if (networkData) {
      const covidtracker = web3.eth.Contract(CovidTraker.abi, networkData.address)
      this.setState({ covidtracker })
      const patientCount = await covidtracker.methods.patientCount().call()
      this.setState({ patientCount })
      console.log(patientCount.toString())

      //load products
      for (var i = 1; i <= patientCount; i++) {
        const patient = await covidtracker.methods.patients(i).call()
        //console.log(product);
        this.setState({
          patients: [...this.state.patients, patient]
        })
      }

      this.setState({ loading: false })
    } else {
      window.alert('CovidTracker contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      patientCount: 0,
      patients: [],
      loading: true
    }

    this.createPatient = this.createPatient.bind(this);
    this.purchasePatient = this.purchasePatient.bind(this);
  }

  //create product
  createPatient(name, patientServiceCharge, passport, fingerPrint, faceRecognize, country) {
    //this.setState({ loading: true })
    const a = this.state.covidtracker.methods.createPatient(name, patientServiceCharge, passport, fingerPrint, faceRecognize, country).send({ from: this.state.account })
      .on('confirmation', function (confirmationNumber, receipt) {
        window.location.reload();
        console.log(receipt);
      }).on('error', (error) => {
        alert(console.error.toString())
        window.location.reload();
      });
  }

  purchasePatient(id, price) {
    this.setState({ loading: true })
    this.state.covidtracker.methods.purchasePatient(id).send({ from: this.state.account, value: price })
      .once('receipt', (receipt) => {
        this.setState({ loading: false })
      }).on('confirmation', function (confirmationNumber, receipt) {
        window.location.reload();
        console.log(receipt);
      }).on('error', (error) => {
        alert(console.error.toString())
        window.location.reload();
      });
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {this.state.loading
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : <Main
                  account={this.state.account}
                  patients={this.state.patients}
                  purchasePatient={this.purchasePatient}
                  createPatient={this.createPatient} />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
