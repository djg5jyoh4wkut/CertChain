const hre = require("hardhat");
const fs = require("fs");

async function main() {
  console.log("Deploying ConfAirdrop contract...");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "ETH");

  // Deploy ConfAirdrop contract
  const ConfAirdrop = await hre.ethers.getContractFactory("ConfAirdrop");
  const confAirdrop = await ConfAirdrop.deploy();

  await confAirdrop.waitForDeployment();

  const contractAddress = await confAirdrop.getAddress();
  console.log("\n✅ ConfAirdrop deployed to:", contractAddress);
  console.log("Deployer address:", deployer.address);

  console.log("\n📝 Deployment Summary:");
  console.log("========================");
  console.log("Contract:", "ConfAirdrop (Public Allocation)");
  console.log("Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Network:", hre.network.name);
  console.log("========================");

  console.log("\n⚠️  IMPORTANT: Update the contract address in:");
  console.log("   ../src/config/contracts.ts");
  console.log("   Replace: CONTRACTS.ConfAirdrop = '" + contractAddress + "'");

  // Save deployment info
  const deploymentInfo = {
    contract: "ConfAirdrop",
    address: contractAddress,
    deployer: deployer.address,
    network: hre.network.name,
    timestamp: new Date().toISOString(),
  };

  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("\n💾 Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
