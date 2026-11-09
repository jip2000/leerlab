import { db } from '@/db/db';
import type { PlannedTest } from '@/db/types';
import { getWords } from '@/features/lists/repo';
import { startSession } from '@/features/practice/repo';
import { makePlan, type PlanDay, type Task } from './schedule';
import { dayKey } from '@/features/progress/streak';

export async function planFor(test: PlannedTest, today = dayKey()): Promise<PlanDay[]> {
  const lists = (await db.lists.bulkGet(test.listIds)).filter((l) => !!l);
  const sizes = await Promise.all(lists.map(async (l) => ({ listId: l!.id, title: l!.title, words: (await getWords(l!.id)).length })));
  return makePlan(today, test.date, sizes, test.topicIds);
}

/** Start een taak uit het leerschema; geeft de pagina terug waar je naartoe gaat. */
export async function startTask(task: Task): Promise<string> {
  if (task.kind === 'grammatica') {
    const [lang, topic] = task.topicIds[0]!.split(':');
    return `/grammatica/${lang}/${topic}`;
  }
  if (task.kind === 'leren') {
    const words = (await getWords(task.listId)).slice(task.from, task.to);
    const id = await startSession({ listIds: [task.listId], mode: 'leren', direction: 'lr', shuffle: true, onlyHard: false, cardKeys: words.map((w) => `${w.id}:lr`) });
    return `/oefenen/${id}`;
  }
  const id = await startSession({ listIds: task.listIds, mode: 'typen', direction: 'mix', shuffle: true, onlyHard: false });
  return `/oefenen/${id}`;
}

export const upcomingTests = async (today = dayKey()) => (await db.tests.where('date').aboveOrEqual(today).sortBy('date'));
