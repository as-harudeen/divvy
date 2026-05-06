import { cn, formatCents } from '@repo/utils';
import { Text, View } from 'react-native';

interface BalanceCardProps {
  netCents: number;
  splitCount: number;
  openSplitCount: number;
  contextName?: string | undefined;
}

function splitCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'split' : 'splits'}`;
}

function balanceLabel(netCents: number, amountLabel: string): string {
  if (netCents > 0) {
    return `You are owed ${amountLabel}`;
  }
  if (netCents < 0) {
    return `You owe ${amountLabel}`;
  }
  return 'Settled';
}

function balanceStatus(netCents: number): string {
  if (netCents > 0) {
    return 'YOU ARE OWED';
  }
  if (netCents < 0) {
    return 'YOU OWE';
  }
  return 'SETTLED';
}

function amountClassName(netCents: number): string {
  if (netCents < 0) {
    return 'text-red-700';
  }
  if (netCents > 0) {
    return 'text-emerald-600';
  }
  return 'text-slate-950';
}

export function BalanceCard({
  netCents,
  splitCount,
  openSplitCount,
  contextName,
}: BalanceCardProps) {
  const isDebtor = netCents < 0;
  const amountLabel = formatCents(Math.abs(netCents));
  const accessibilityLabel = balanceLabel(netCents, amountLabel);

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      testID="balance-card"
      className={cn(
        'rounded-xl border px-3 py-3',
        isDebtor ? 'border-red-200 bg-red-50' : 'border-white bg-white',
      )}
      style={{
        shadowColor: isDebtor ? '#DC2626' : '#64748B',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: isDebtor ? 0.08 : 0.06,
        shadowRadius: 10,
        elevation: 2,
      }}
    >
      <View className="gap-1.5">
        <View className="flex-row items-start justify-between gap-3">
          <Text
            testID="balance-status"
            className={cn(
              'text-[9px] font-bold uppercase tracking-wide',
              isDebtor ? 'text-red-600' : 'text-slate-500',
            )}
          >
            {balanceStatus(netCents)}
          </Text>
          <Text
            testID="balance-amount"
            className={cn('font-mono-medium text-xl', amountClassName(netCents))}
          >
            {amountLabel}
          </Text>
        </View>

        <View className="flex-row items-center justify-between gap-3">
          <Text className="text-[10px] font-medium text-slate-500">
            {splitCountLabel(splitCount)} - {openSplitCount} open
          </Text>
          <View className="flex-row items-center gap-1">
            <Text className="text-[10px] font-semibold text-blue-600">View balances</Text>
            <Text
              testID="view-balances-arrow-icon"
              className="text-[11px] font-semibold text-blue-600"
            >
              →
            </Text>
          </View>
        </View>

        {contextName === undefined ? null : (
          <Text testID="balance-context" className="text-[10px] font-medium text-slate-400">
            Filtered to {contextName}
          </Text>
        )}
      </View>
    </View>
  );
}
