import type { Group, GroupId, Person } from '@repo/types';
import { cn, formatCents } from '@repo/utils';
import * as React from 'react';
import {
  Pressable,
  type PressableProps,
  Text,
  type View,
  View as ViewComponent,
} from 'react-native';

import { AvatarStack } from '../primitives/AvatarStack';
import { Pill } from '../primitives/Pill';

interface GroupCardProps extends Omit<PressableProps, 'children'> {
  group: Group;
  members: Person[];
  activeGroupId: GroupId | null;
  totalCents: number;
  lastActivityLabel: string;
  className?: string;
}

function statusLabelFor(group: Group): string {
  return group.status === 'active' ? 'Open' : 'Settled';
}

export const GroupCard = React.forwardRef<View, GroupCardProps>(
  (
    {
      group,
      members,
      activeGroupId,
      totalCents,
      lastActivityLabel,
      className,
      accessibilityState,
      ...props
    },
    ref,
  ) => {
    const isActive = group.id === activeGroupId;
    const memberLabel = `${members.length} ${members.length === 1 ? 'person' : 'people'}`;
    const amountLabel = formatCents(totalCents);
    const metadataLabel = `${memberLabel} - ${lastActivityLabel}`;

    return (
      <ViewComponent testID="group-card-frame" className={cn('relative', isActive && 'pt-2.5')}>
        {isActive ? (
          <ViewComponent
            testID="group-card-active-badge"
            className="absolute right-3 top-0 z-10 h-5 w-[78px] items-end"
          >
            <Pill
              variant="info"
              className="h-full items-center justify-center bg-blue-600 px-2.5 py-0"
              textClassName="text-[10px] font-bold text-white"
            >
              ACTIVE
            </Pill>
          </ViewComponent>
        ) : null}

        <Pressable
          ref={ref}
          accessibilityRole="button"
          accessibilityLabel={`${group.name}, ${statusLabelFor(group)}, ${memberLabel}, ${amountLabel}`}
          accessibilityState={{ selected: isActive, ...accessibilityState }}
          className={cn(
            'relative rounded-xl border bg-white px-3 py-3 active:bg-gray-50',
            isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200',
            className,
          )}
          {...props}
        >
          <ViewComponent className="flex-row items-center justify-between gap-3">
            <ViewComponent className="flex-row flex-1 items-center gap-3">
              <AvatarStack people={members} />
              <ViewComponent className="flex-1 gap-0.5">
                <Text className="text-base font-bold text-slate-950">{group.name}</Text>
                <Text className="text-xs text-slate-500">{metadataLabel}</Text>
              </ViewComponent>
            </ViewComponent>

            <ViewComponent className="min-w-[78px] items-end gap-1">
              <Text className="font-mono-medium text-base text-slate-950">{amountLabel}</Text>
              <Pill
                variant={group.status === 'active' ? 'warning' : 'success'}
                testID="group-card-status-pill"
                className={cn(
                  'self-end px-0 py-0',
                  group.status === 'active' ? 'bg-amber-50' : 'bg-white',
                )}
                textClassName={cn(
                  'text-xs',
                  group.status === 'active' ? 'text-amber-700' : 'text-green-700',
                )}
              >
                {statusLabelFor(group)}
              </Pill>
            </ViewComponent>
          </ViewComponent>
        </Pressable>
      </ViewComponent>
    );
  },
);

GroupCard.displayName = 'GroupCard';
