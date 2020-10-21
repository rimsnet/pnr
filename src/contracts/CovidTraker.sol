pragma solidity ^0.5.0;

contract CovidTraker {
    string public name;
    uint public patientCount = 0;
    mapping(uint => Patient) public patients;

    struct Patient {
        uint id;
        string name;
        uint serviceCharge;
        address payable owner;
        bool isTested;
        string passportNumber;
        string fingerPrint;
        string faceRecognise;
        string country;
    }

    event PatientCreated(
        uint id,
        string name,
        uint serviceCharge,
        address payable owner,
        bool isTested,
        string passportNumber,
        string fingerPrint,
        string faceRecognise,
        string country
    );

    event PatientPurchased(
        uint id,
        string name,
        uint serviceCharge,
        address payable owner,
        bool isTested
        /* string passportNumber,
        string fingerPrint,
        string faceRecognise,
        string country */
    );

    constructor() public {
        name = "UTP CovidTraker";
    }

    function createPatient(string memory _name, uint _serviceCharge, string memory _passportNumber, string  memory _fingerPrint, string memory _faceRecognise, string memory _country) public {
        // Require a valid name
        require(bytes(_name).length > 0);
        // Require a valid _serviceCharge
        require(_serviceCharge > 0);
        // Increment patient count
        patientCount ++;
        // Create the patient
        patients[patientCount] = Patient(patientCount, _name, _serviceCharge, msg.sender, false, _passportNumber, _fingerPrint, _faceRecognise, _country);
        // Trigger an event
        emit PatientCreated(patientCount, _name, _serviceCharge, msg.sender, false, _passportNumber, _fingerPrint, _faceRecognise, _country );
    }

    function purchasePatient(uint _id) public payable {
        // Fetch the patient
        Patient memory _patient = patients[_id];
        // Fetch the owner
        address payable _seller = _patient.owner;
        // Make sure the patient has a valid id
        require(_patient.id > 0 && _patient.id <= patientCount);
        // Require that there is enough Ether in the transaction
        require(msg.value >= _patient.serviceCharge);
        // Require that the patient has not been isTested already
        require(!_patient.isTested);
        // Require that the buyer is not the seller
        require(_seller != msg.sender);
        // Transfer ownership to the buyer
        _patient.owner = msg.sender;
        // Mark as isTested
        _patient.isTested = true;
        // Update the patient
        patients[_id] = _patient;
        // Pay the seller by sending them Ether
        address(_seller).transfer(msg.value);
        // Trigger an event
        emit PatientPurchased(patientCount, _patient.name, _patient.serviceCharge, msg.sender, true);
    }
}
