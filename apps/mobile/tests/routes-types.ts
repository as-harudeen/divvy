import type { Href, HrefInputParams } from 'expo-router';

const validRootHref: Href = '/';
const validGroupNewHref: Href = '/group/new';
const validGroupDetailHref: Href = { pathname: '/group/[id]', params: { id: 'abc' } };
const validSplitNewHref: Href = { pathname: '/group/[id]/split/new', params: { id: 'abc' } };
const validSettleHref: Href = {
  pathname: '/group/[id]/split/[splitId]/settle',
  params: { id: 'abc', splitId: 'def' },
};
const validDetailHref: Href = {
  pathname: '/group/[id]/split/[splitId]/detail',
  params: { id: 'abc', splitId: 'def' },
};

// @ts-expect-error — missing required id param for dynamic route
const missingParamHref: HrefInputParams = { pathname: '/group/[id]', params: {} };

// @ts-expect-error — invalid pathname not in route map
const invalidPathname: HrefInputParams = { pathname: '/nonexistent/route' };

// @ts-expect-error — missing required splitId param
const missingSplitIdHref: HrefInputParams = {
  pathname: '/group/[id]/split/[splitId]/settle',
  params: { id: 'abc' },
};

void validRootHref;
void validGroupNewHref;
void validGroupDetailHref;
void validSplitNewHref;
void validSettleHref;
void validDetailHref;
void missingParamHref;
void invalidPathname;
void missingSplitIdHref;
