import express from 'express';
import { BadRequestResponse, SuccessResponse } from '../../core/ApiResponse';
import asyncHandler from '../../helpers/asyncHandler';
import { PublicRequest } from '../../types/app-request';
import WarehouseRepo from '../../database/repository/WarehouseRepo';
import { sortedDate, findClosestCombination } from '../../helpers/utils';
const router = express.Router();

router.get(
  '/calculatecoil/:item/:limit?/:weight?',
  asyncHandler(async (req: PublicRequest, res) => {
    const start = performance.now();
    const { item, limit, weight }: any = req.params;

    const items = await WarehouseRepo.getRowsByItemId(item);
    if (!items || items.length === 0)
      return new BadRequestResponse('Item not found').send(res);

    const dataSort = sortedDate(items);

    if (limit && limit > 0 && weight <= 0) {
      const data = dataSort.slice(0, limit);
      return new SuccessResponse('success', { coils: data }).send(res);
    }

    if (weight && weight > 0 && (!limit || Number(limit) <= 0)) {
      const itemWeights = items.map((item) => ({
        product: item,
        weight: parseFloat(item.weightInfo.netWeight.toString()),
      }));

      const targetWeight: number = parseFloat(weight);

      const closestCombination = await findClosestCombination(
        itemWeights || [],
        targetWeight,
      );

      const weights = closestCombination.map((item) => item.weight);
      const duration = (performance.now() - start) / 1000;
      console.log(`duration: ${duration.toFixed(4)} seconds`);

      return new SuccessResponse('Successful', {
        closestCombination: closestCombination.map((item) => ({
          product: item.product,
          weight: item.weight,
        })),
        targetWeight,
        responseWeight: weights,
        netWeights: itemWeights.map((i) => i.weight),
      }).send(res);
    }

    return new BadRequestResponse('Invalid parameters').send(res);
  }),
);

// const generateTestData = (numItems: number) => {
//   const items = [];
//   for (let i = 0; i < numItems; i++) {
//     items.push({
//       id: `item_${i}`,
//       weight: Math.floor(Math.random() * 100 + 1),
//     });
//   }
//   return items;
// };
const generateTestData = (numItems: number) => {
  const predefinedWeights = [5, 4, 3.1, 8, 10, 12, 15, 2, 6, 9];
  const items = [];
  for (let i = 0; i < numItems; i++) {
    const weightIndex = i % predefinedWeights.length;
    items.push({
      id: `item_${i}`,
      weight: predefinedWeights[weightIndex],
    });
  }
  return items;
};

router.get(
  '/testdata/:limit?/:weight?',
  asyncHandler(async (req: PublicRequest, res) => {
    const start = performance.now();
    const { limit, weight }: any = req.params;

    const items = generateTestData(500000);

    if (!items || items.length === 0)
      return new BadRequestResponse('No items generated').send(res);

    if (limit && limit > 0 && weight <= 0) {
      const data = items.slice(0, limit);
      return new SuccessResponse('success', { coils: data }).send(res);
    }

    if (weight && Number(weight) > 0 && (!limit || Number(limit) <= 0)) {
      const itemWeights = items.map((item) => ({
        product: item.id,
        weight: item.weight,
      }));

      const targetWeight: number = Number(weight);
      const closestCombination = await findClosestCombination(
        itemWeights,
        targetWeight,
      );

      let sum: number = 0;
      for (let i = 0; i < closestCombination.length; i++) {
        sum += closestCombination[i].weight;
      }
      const duration = (performance.now() - start) / 1000;
      console.log(`duration: ${duration.toFixed(4)} seconds`);
      return new SuccessResponse('Successful', {
        closestCombination: closestCombination.map((item) => ({
          product: item.product,
          weight: item.weight,
        })),
        targetWeight,
        responseWeight: sum,
        netWeights: itemWeights.map((i) => i.weight),
      }).send(res);
    }

    return new BadRequestResponse('Invalid parameters').send(res);
  }),
);

export default router;
