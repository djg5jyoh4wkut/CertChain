const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying ConfAirdrop contract...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const ConfAirdrop = await ethers.getContractFactory("ConfAirdrop");
  console.log("Deploying ConfAirdrop...");

  const confAirdrop = await ConfAirdrop.deploy();
  await confAirdrop.waitForDeployment();

  const address = await confAirdrop.getAddress();
  console.log("ConfAirdrop deployed to:", address);
  console.log("");
  console.log("Update your frontend config with this address:");
  console.log(`  ConfAirdrop: "${address}" as \`0x\${string}\`,`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
