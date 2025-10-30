import { useEffect, useState } from "react";
import { usePublicClient, useBlockNumber } from "wagmi";
import { CONTRACTS, ABIS } from "@/config/contracts";
import { formatDistanceToNow } from "date-fns";

export type HistoryEvent = {
  id: string;
  type: "Allocation Set" | "Batch Allocation" | "Claimed";
  creator?: string;
  recipient?: string;
  user?: string;
  count?: number;
  blockNumber: bigint;
  timestamp: number;
  txHash: string;
  status: "Confirmed";
};

export function useHistory() {
  const [events, setEvents] = useState<HistoryEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const publicClient = usePublicClient();
  const { data: currentBlock } = useBlockNumber({ watch: true });

  useEffect(() => {
    if (!publicClient) return;

    const fetchEvents = async () => {
      try {
        setIsLoading(true);

        const toBlock = await publicClient.getBlockNumber();
        // Reduce from 10000 to 500 blocks to avoid RPC limit (max 1000)
        const fromBlock = toBlock > 500n ? toBlock - 500n : 0n;

        console.log('[useHistory] Fetching events from block', fromBlock.toString(), 'to', toBlock.toString());

        // Get event definitions from ABI
        const allocationSetEvent = ABIS.ConfAirdrop.find((abi: any) => abi.type === "event" && abi.name === "AllocationSet");
        const claimedEvent = ABIS.ConfAirdrop.find((abi: any) => abi.type === "event" && abi.name === "Claimed");
        const batchSetEvent = ABIS.ConfAirdrop.find((abi: any) => abi.type === "event" && abi.name === "AllocationBatchSet");

        console.log('[useHistory] Event ABIs found:', {
          allocationSet: !!allocationSetEvent,
          claimed: !!claimedEvent,
          batchSet: !!batchSetEvent
        });

        const allocationSetLogs = await publicClient.getLogs({
          address: CONTRACTS.ConfAirdrop,
          event: allocationSetEvent,
          fromBlock,
          toBlock,
        });

        console.log('[useHistory] AllocationSet logs:', allocationSetLogs.length);

        const claimedLogs = await publicClient.getLogs({
          address: CONTRACTS.ConfAirdrop,
          event: claimedEvent,
          fromBlock,
          toBlock,
        });

        console.log('[useHistory] Claimed logs:', claimedLogs.length);

        const batchSetLogs = await publicClient.getLogs({
          address: CONTRACTS.ConfAirdrop,
          event: batchSetEvent,
          fromBlock,
          toBlock,
        });

        console.log('[useHistory] BatchSet logs:', batchSetLogs.length);

        const allLogs = [...allocationSetLogs, ...claimedLogs, ...batchSetLogs];
        const uniqueBlocks = [...new Set(allLogs.map(log => log.blockNumber))];
        
        const blockTimestamps = await Promise.all(
          uniqueBlocks.map(async (blockNumber) => {
            const block = await publicClient.getBlock({ blockNumber: blockNumber as bigint });
            return { blockNumber, timestamp: Number(block.timestamp) };
          })
        );

        const timestampMap = Object.fromEntries(
          blockTimestamps.map(({ blockNumber, timestamp }) => [blockNumber.toString(), timestamp])
        );

        const allocationEvents: HistoryEvent[] = allocationSetLogs.map((log: any) => ({
          id: log.transactionHash + "-" + log.logIndex,
          type: "Allocation Set" as const,
          creator: log.args.creator,
          recipient: log.args.recipient,
          blockNumber: log.blockNumber,
          timestamp: timestampMap[log.blockNumber.toString()] || 0,
          txHash: log.transactionHash,
          status: "Confirmed" as const,
        }));

        const claimedEvents: HistoryEvent[] = claimedLogs.map((log: any) => ({
          id: log.transactionHash + "-" + log.logIndex,
          type: "Claimed" as const,
          user: log.args.user,
          blockNumber: log.blockNumber,
          timestamp: timestampMap[log.blockNumber.toString()] || 0,
          txHash: log.transactionHash,
          status: "Confirmed" as const,
        }));

        const batchEvents: HistoryEvent[] = batchSetLogs.map((log: any) => ({
          id: log.transactionHash + "-" + log.logIndex,
          type: "Batch Allocation" as const,
          creator: log.args.creator,
          count: Number(log.args.count),
          blockNumber: log.blockNumber,
          timestamp: timestampMap[log.blockNumber.toString()] || 0,
          txHash: log.transactionHash,
          status: "Confirmed" as const,
        }));

        const allEvents = [...allocationEvents, ...claimedEvents, ...batchEvents].sort(
          (a, b) => Number(b.blockNumber) - Number(a.blockNumber)
        );

        console.log('[useHistory] Total events:', allEvents.length);
        setEvents(allEvents);
      } catch (error) {
        console.error("[useHistory] Error fetching events:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [publicClient, currentBlock]);

  return {
    events,
    isLoading,
  };
}

export function formatAddress(address: string): string {
  if (!address) return "";
  return address.substring(0, 6) + "..." + address.substring(address.length - 4);
}

export function formatTimestamp(timestamp: number): string {
  if (!timestamp) return "Unknown";
  return formatDistanceToNow(new Date(timestamp * 1000), { addSuffix: true });
}
