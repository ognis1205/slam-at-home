/**
 * @fileoverview Defines React.Key helper functions.
 * @copyright Shingo OKAWA 2022
 */

/** Key diff status. */
export const Status = {
  ADD: 'add',
  KEEP: 'keep',
  REMOVE: 'remove',
  REMOVED: 'removed',
} as const;

export type Status = typeof Status[keyof typeof Status];

/** React.Key with Status. */
export interface WithStatus {
  key: string;
  status?: Status;
}

/** Wraps a given `React.Key` object with a status. */
export const wrap = (key: React.Key): WithStatus => {
  let obj: WithStatus;
  if (key && typeof key === 'object' && 'key' in key) {
    obj = key;
  } else {
    obj = { key };
  }
  return {
    ...obj,
    key: String(keyObj.key),
  } as WithStatus;
};

/** Maps a given keys into `WithStatus` objects.*/
export const parse = (keys = []): WithStatus[] => keys.map(wrap);

/** Computes the difference `lhs - rhs`. */
export const diff = (
  lhs: WithStatus[] = [],
  rhs: WithStatus[] = []
): WithStatus[] => {
  let diffs: WithStatus[] = [];
  let curr = 0;
  const len = rhs.length;
  const lhsObjs = parse(lhs);
  const rhsObjs = parse(rhs);

  // Check prev keys to insert or keep
  lhsObjs.forEach((lhsObj) => {
    let hit = false;
    for (let i = curr; i < len; i += 1) {
      const rhsObj = rhsObjs[i];
      if (rhsObj.key === lhsObj.key) {
        if (curr < i) {
          diffs = diffs.concat(
            rhsObjs
              .slice(curr, i)
              .map((obj) => ({ ...obj, status: Status.ADD }))
          );
          curr = i;
        }
        diffs.push({
          ...rhsObj,
          status: Status.KEEP,
        });
        curr += 1;
        hit = true;
        break;
      }
    }
    if (!hit) {
      diffs.push({
        ...lhsObj,
        status: Status.REMOVE,
      });
    }
  });

  // Add rest to the list
  if (curr < len) {
    diffs = diffs.concat(
      rhsObjs.slice(curr).map((obj) => ({ ...obj, status: Status.ADD }))
    );
  }

  // Merge same key when it remove and add again:
  // [1 - add, 2 - keep, 1 - remove] -> [1 - keep, 2 - keep]
  const keys = {};
  diffs.forEach(({ key }) => {
    keys[key] = (keys[key] || 0) + 1;
  });
  const dups = Object.keys(keys).filter((key) => keys[key] > 1);
  dups.forEach((dup) => {
    diffs = diffs.filter(
      ({ key, status }) => key !== dup || status !== Status.REMOVE
    );
    diffs.forEach((diff) => {
      if (diff.key === dup) {
        // eslint-disable-next-line no-param-reassign
        diff.status = Status.KEEP;
      }
    });
  });

  return diffs;
};
