import type { Split } from '@repo/types';
import { cn, formatCents } from '@repo/utils';
import { Pressable, Text, View } from 'react-native';

interface SplitRowProps {
  split: Split;
  onPress: (split: Split) => void;
}

function formatSplitTime(createdAt: string, now = new Date()): string {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) {
    return 'Recent';
  }

  const splitDay = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const yesterday = today - 24 * 60 * 60 * 1000;
  const timeLabel = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);

  if (splitDay === today) {
    return `Today · ${timeLabel}`;
  }
  if (splitDay === yesterday) {
    return `Yesterday · ${timeLabel}`;
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

function statusConfig(split: Split): {
  label: string;
  containerClassName: string;
  mark: 'check' | 'dot';
} {
  if (split.settlementStatus === 'settled') {
    return {
      label: 'Settled',
      containerClassName: 'bg-success-light',
      mark: 'check',
    };
  }

  return {
    label: 'Open',
    containerClassName: 'bg-warning-light',
    mark: 'dot',
  };
}

function StatusMark({
  splitId,
  mark,
  label,
}: {
  splitId: Split['id'];
  mark: 'check' | 'dot';
  label: string;
}) {
  if (mark === 'check') {
    return (
      <Text
        accessibilityLabel={`${label} status icon`}
        testID={`split-row-status-mark-${splitId}`}
        className="text-xl font-bold text-success"
      >
        ✓
      </Text>
    );
  }

  return (
    <View
      accessibilityLabel={`${label} status icon`}
      testID={`split-row-status-mark-${splitId}`}
      className="h-2 w-2 rounded-full bg-warning"
    />
  );
}

export function SplitRow({ split, onPress }: SplitRowProps) {
  const amountLabel = formatCents(split.totalCents);
  const status = statusConfig(split);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${split.label}, ${amountLabel}, ${status.label}`}
      testID={`split-row-${split.id}`}
      className="min-h-[76px] rounded-[20px] border border-[#E5E7EB] bg-white px-4 py-4 active:bg-slate-50"
      onPress={() => onPress(split)}
    >
      <View className="flex-row items-center gap-4">
        <View
          testID={`split-row-status-${split.id}`}
          className={cn(
            'h-11 w-11 items-center justify-center rounded-2xl',
            status.containerClassName,
          )}
        >
          <StatusMark splitId={split.id} mark={status.mark} label={status.label} />
        </View>

        <View className="flex-1 gap-1">
          <Text
            testID={`split-row-title-${split.id}`}
            className="text-base font-bold text-[#0B1538]"
            numberOfLines={1}
          >
            {split.label}
          </Text>
          <Text
            testID={`split-row-time-${split.id}`}
            className="text-sm font-medium text-slate-500"
          >
            {formatSplitTime(split.createdAt)}
          </Text>
        </View>

        <Text
          testID={`split-row-amount-${split.id}`}
          className="font-mono-medium text-base text-[#0B1538]"
        >
          {amountLabel}
        </Text>
      </View>
    </Pressable>
  );
}
