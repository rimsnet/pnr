import React, { Component } from 'react';

class UserDetails extends Component {

  render() {
    return (
      <div id="content">
        <h3>Add Details</h3>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.patientName.value.toString();
          const country = this.patientCountry.value.toString();
          const passport = this.patientPassport.value.toString();
          const fingerPrint = this.patientFingerPrint.value.toString();
          const faceRecognize = this.patientFaceRecognize.value.toString();
          const patientServiceCharge = window.web3.utils.toWei(this.patientServiceCharge.value.toString(), 'Ether')
          this.props.createPatient(name, patientServiceCharge, passport, fingerPrint, faceRecognize, country)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="patientName"
              type="text"
              ref={(input) => { this.patientName = input }}
              className="form-control"
              placeholder="Patient's full name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="patientPassport"
              type="text"
              ref={(input) => { this.patientPassport = input }}
              className="form-control"
              placeholder="Passport number"
              required />

          </div>
          <div className="form-group mr-sm-2">


            <div className="input-group mb-3">
              <input type="text" className="form-control"
                readOnly
                id="patientFingerPrint"
                ref={(input) => { this.patientFingerPrint = input }}
                placeholder="Finger Print"
                aria-label="Finger Print"
                aria-describedby="basic-addon2" />
              <div className="input-group-append">
                <button className="btn btn-outline-secondary"
                  type="button"
                  onClick={((event) => {
                    var rand = 1 + (Math.random() * (100 - 1));
                    this.patientFingerPrint.value = rand.toString();
                  })}
                >Add</button>
              </div>
            </div>

          </div>
          <div className="form-group mr-sm-2">
            <div className="input-group mb-3">
              <input type="text" className="form-control"
                readOnly
                id="patientFaceRecognize"
                ref={(input) => { this.patientFaceRecognize = input }}
                placeholder="Face recognize"
                aria-label="Face recognize"
                aria-describedby="basic-addon2" />
              <div className="input-group-append">
                <button className="btn btn-outline-secondary"
                  type="button"
                  onClick={((event) => {
                    var rand = 1 + (Math.random() * (100 - 1));
                    this.patientFaceRecognize.value = rand.toString();
                  })}
                >Add</button>
              </div>
            </div>

          </div>
          <div className="form-group mr-sm-2">
            <input
              id="patientPrice"
              type="text"
              ref={(input) => { this.patientServiceCharge = input }}
              className="form-control"
              placeholder="Service charge for user access"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="patientCountry"
              type="text"
              ref={(input) => { this.patientCountry = input }}
              className="form-control"
              placeholder="Country example : MY"
              required />
          </div>


          <a href="https://covid19portal.herokuapp.com/" className="btn btn-primary">Back</a>&nbsp;
          <button type="button" className="btn btn-primary">Search</button>&nbsp;
          <button type="submit" className="btn btn-primary">Add Person</button>
        </form>
        <p>&nbsp;</p>
        <h3>Data records</h3>
        <table className="table table-bordered table-hover table-sm">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Full Name</th>
              <th scope="col">Country</th>
              <th scope="col">Passport</th>
              <th scope="col">Finger Print</th>
              <th scope="col">Face Recognise</th>
              <th scope="col">Service Charge</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            {this.props.patients.map((patient, key) => {
              console.log(patient);
              return (
                <tr key={key}>
                  <th scope="row">{patient.id.toString()}</th>
                  <td>{patient.name}</td>
                  <td>{patient.country}</td>
                  <td>{patient.passportNumber}</td>
                  <td>{patient.fingerPrint}</td>
                  <td>{patient.faceRecognise}</td>
                  <td>{window.web3.utils.fromWei(patient.serviceCharge.toString(), 'Ether')} Eth</td>
                  <td><a href={"http://localhost:3000/user/" + patient.owner}>{patient.owner}</a></td>
                  <td>

                    <button
                      name={patient.id}
                      value={patient.serviceCharge}
                      onClick={(event) => {
                        this.props.purchasePatient(event.target.name, event.target.value)
                      }}>Check Details</button>

                  </td>
                </tr>
              )
            })}


          </tbody>
        </table>
      </div>
    );
  }
}

export default UserDetails;
