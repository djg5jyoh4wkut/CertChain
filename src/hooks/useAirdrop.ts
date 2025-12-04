import { useAccount, useReadContract, useWriteContract } from "wagmi";
import { CONTRACTS, ABIS } from "@/lib/contracts";
import { encryptQuotaAmount, initializeFHE } from "@/lib/fhe";

/**
 * Hook for interacting with the ConfAirdrop contract
 * Note: Transaction status notifications are handled by the page components
 */
export function useAirdrop() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  // Read user's allocation
  const { data: myAllocation, refetch: refetchAllocation } = useReadContract({
    address: CONTRACTS.ConfAirdrop,
    abi: ABIS.ConfAirdrop,
    functionName: "getMyAllocation",
    account: address,
  });

  // Read user's claimed amount
  const { data: myClaimed, refetch: refetchClaimed } = useReadContract({
    address: CONTRACTS.ConfAirdrop,
    abi: ABIS.ConfAirdrop,
    functionName: "getMyClaimed",
    account: address,
  });

  // Read user's remaining amount
  const { data: myRemaining, refetch: refetchRemaining } = useReadContract({
    address: CONTRACTS.ConfAirdrop,
    abi: ABIS.ConfAirdrop,
    functionName: "getMyRemaining",
    account: address,
  });

  /**
   * Set allocation for a user (anyone can create allocations)
   */
  const setAllocation = async (recipientAddress: string, amount: bigint) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      // Initialize FHE
      await initializeFHE();

      // Encrypt the quota amount (v0.9.1 API: amount, userAddress)
      const { encryptedAmount, proof } = await encryptQuotaAmount(
        amount,
        address
      );

      // Call contract
      const hash = await writeContractAsync({
        address: CONTRACTS.ConfAirdrop,
        abi: ABIS.ConfAirdrop,
        functionName: "setAllocation",
        args: [recipientAddress as `0x${string}`, encryptedAmount, proof],
      });

      console.log('[useAirdrop] Transaction submitted:', hash);
      return hash;
    } catch (error) {
      console.error("Error setting allocation:", error);
      throw error;
    }
  };

  /**
   * Claim quota (user)
   */
  const claim = async (amount: bigint) => {
    if (!address) {
      throw new Error("Wallet not connected");
    }

    try {
      // Initialize FHE
      await initializeFHE();

      // Encrypt the claim amount (v0.9.1 API: amount, userAddress)
      const { encryptedAmount, proof } = await encryptQuotaAmount(
        amount,
        address
      );

      // Call contract
      const hash = await writeContractAsync({
        address: CONTRACTS.ConfAirdrop,
        abi: ABIS.ConfAirdrop,
        functionName: "claim",
        args: [encryptedAmount, proof],
      });

      console.log('[useAirdrop] Claim transaction submitted:', hash);
      return hash;
    } catch (error) {
      console.error("Error claiming:", error);
      throw error;
    }
  };

  return {
    // User data (encrypted values as bytes32)
    myAllocation,
    myClaimed,
    myRemaining,

    // Actions
    setAllocation,
    claim,

    // Refetch functions
    refetchAllocation,
    refetchClaimed,
    refetchRemaining,
  };
}
