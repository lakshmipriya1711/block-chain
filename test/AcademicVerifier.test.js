const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('AcademicVerifier', function () {
  it('issues and verifies a credential', async function () {
    const [issuer] = await ethers.getSigners();
    const Verifier = await ethers.getContractFactory('AcademicVerifier');
    const verifier = await Verifier.deploy();
    const hash = ethers.keccak256(ethers.toUtf8Bytes('credential-001'));
    await verifier.issueCredential(hash);
    const result = await verifier.verifyCredential(hash);
    expect(result.exists).to.equal(true);
    expect(result.valid).to.equal(true);
    expect(result.issuer).to.equal(issuer.address);
  });

  it('allows an issuer to revoke a credential', async function () {
    const [issuer] = await ethers.getSigners();
    const Verifier = await ethers.getContractFactory('AcademicVerifier');
    const verifier = await Verifier.deploy();
    const hash = ethers.keccak256(ethers.toUtf8Bytes('credential-002'));
    await verifier.issueCredential(hash);
    await verifier.revokeCredential(hash);
    const result = await verifier.verifyCredential(hash);
    expect(result.valid).to.equal(false);
    expect(result.issuer).to.equal(issuer.address);
  });
});
