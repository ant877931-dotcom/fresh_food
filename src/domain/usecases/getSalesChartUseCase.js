import { adminRepository } from '../../infrastructure/repositories/adminRepository.js';

export const getSalesChartUseCase = {
  async execute(timeframe) {
    const rawOrders = await adminRepository.getAnalyticsData(timeframe);

    // Filter out unpaid/cancelled orders if necessary, assuming all are completed or delivered for analytics
    // or we just take all orders. Let's take all orders for now or filter by status === 'delivered'
    const validOrders = rawOrders.filter(o => o.status !== 'cancelled');

    const groupedData = {};

    validOrders.forEach(order => {
      const date = new Date(order.created_at);
      let key;

      if (timeframe === 'Hari Ini') {
        key = `${date.getHours()}:00`;
      } else if (timeframe === 'Bulan Ini') {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      } else {
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      }

      if (!groupedData[key]) {
        groupedData[key] = 0;
      }
      groupedData[key] += order.total_amount;
    });

    // Sort keys
    const labels = Object.keys(groupedData).sort();
    const data = labels.map(label => groupedData[label]);

    return { labels, data };
  }
};
