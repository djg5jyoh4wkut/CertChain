import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { CONTRACTS, ABIS } from "@/config/contracts";
import { encryptQuotaAmount, initializeFHE } from "@/lib/fhe";
import { useToast } from "@/hooks/use-toast";

/**
 * Hook for interacting with the ConfAirdrop contract
 */
export function useAirdrop() {
  const { address } = useAccount();
  const { toast } = useToast();
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

      // Encrypt the quota amount
      const { encryptedAmount, proof } = await encryptQuotaAmount(
        amount,
        CONTRACTS.ConfAirdrop,
        address
      );

      // Call contract
      const hash = await writeContractAsync({
        address: CONTRACTS.ConfAirdrop,
        abi: ABIS.ConfAirdrop,
        functionName: "setAllocation",
        args: [recipientAddress as `0x${string}`, encryptedAmount, proof],
      });

      toast({
        title: "Allocation Created",
        description: "Encrypted allocation created successfully",
      });

      return hash;
    } catch (error) {
      console.error("Error setting allocation:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set allocation",
        variant: "destructive",
      });
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

      // Encrypt the claim amount
      const { encryptedAmount, proof } = await encryptQuotaAmount(
        amount,
        CONTRACTS.ConfAirdrop,
        address
      );

      // Call contract
      const hash = await writeContractAsync({
        address: CONTRACTS.ConfAirdrop,
        abi: ABIS.ConfAirdrop,
        functionName: "claim",
        args: [encryptedAmount, proof],
      });

      toast({
        title: "Claim Submitted",
        description: "Your claim transaction has been submitted",
      });

      // Refetch data after claim
      setTimeout(() => {
        refetchAllocation();
        refetchClaimed();
        refetchRemaining();
      }, 3000);

      return hash;
    } catch (error) {
      console.error("Error claiming:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to claim",
        variant: "destructive",
      });
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
