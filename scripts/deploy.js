const hre = require('hardhat');

async function main() {
  const AcademicVerifier = await hre.ethers.getContractFactory('AcademicVerifier');
  const verifier = await AcademicVerifier.deploy();
  await verifier.waitForDeployment();
  console.log(`AcademicVerifier deployed to ${await verifier.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
