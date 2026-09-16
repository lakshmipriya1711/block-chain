// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract AcademicVerifier {
    struct Credential {
        bytes32 documentHash;
        address issuer;
        uint256 issuedAt;
        bool revoked;
    }

    mapping(bytes32 => Credential) public credentials;
    event CredentialIssued(bytes32 indexed documentHash, address indexed issuer, uint256 issuedAt);
    event CredentialRevoked(bytes32 indexed documentHash, address indexed issuer);

    function issueCredential(bytes32 documentHash) external {
        require(credentials[documentHash].issuedAt == 0, 'Credential already exists');
        credentials[documentHash] = Credential(documentHash, msg.sender, block.timestamp, false);
        emit CredentialIssued(documentHash, msg.sender, block.timestamp);
    }

    function revokeCredential(bytes32 documentHash) external {
        Credential storage credential = credentials[documentHash];
        require(credential.issuer == msg.sender, 'Only issuer can revoke');
        require(credential.issuedAt != 0, 'Credential not found');
        credential.revoked = true;
        emit CredentialRevoked(documentHash, msg.sender);
    }

    function verifyCredential(bytes32 documentHash) external view returns (bool exists, bool valid, address issuer, uint256 issuedAt) {
        Credential memory credential = credentials[documentHash];
        exists = credential.issuedAt != 0;
        valid = exists && !credential.revoked;
        issuer = credential.issuer;
        issuedAt = credential.issuedAt;
    }
}
