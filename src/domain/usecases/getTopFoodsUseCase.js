import { adminRepository } from '../../infrastructure/repositories/adminRepository.js';

export const getTopFoodsUseCase = {
  async execute(timeframe) {
    const rawOrders = await adminRepository.getAnalyticsData(timeframe);

    const validOrders = rawOrders.filter(o => o.status !== 'cancelled');
    const foodCounts = {};

    validOrders.forEach(order => {
      if (order.order_items && Array.isArray(order.order_items)) {
        order.order_items.forEach(item => {
          const foodName = item.foods?.name || 'Unknown';
          if (!foodCounts[foodName]) {
            foodCounts[foodName] = 0;
          }
          foodCounts[foodName] += item.quantity;
        });
      }
    });

    // Convert to array and sort
    const topFoods = Object.keys(foodCounts).map(name => {
      return {
        name,
        totalSold: foodCounts[name]
      };
    }).sort((a, b) => b.totalSold - a.totalSold).slice(0, 5);

    return topFoods;
  }
};
