// src/infrastructure/repositories/foodRepository.js
import { supabase } from '../config/supabase.js';
import { Food } from '../../domain/entities/Food.js';

export const foodRepository = {
  /**
   * Mengambil semua data makanan dengan opsional pencarian dan filter kategori
   * @param {string} searchQuery 
   * @param {string} category 
   * @returns {Promise<Food[]>}
   */
  async getAllFoods(searchQuery = '', category = '') {
    try {
      let query = supabase.from('foods').select('*, categories!inner(name)');

      if (searchQuery) {
        query = query.ilike('name', `%${searchQuery}%`);
      }

      if (category && category !== 'All' && category !== 'Semua') {
        query = query.eq('categories.name', category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(item => {
        if (item.categories && item.categories.name) {
          item.category = item.categories.name;
        }
        return new Food(item);
      });
    } catch (error) {
      console.error('Error fetching foods:', error);
      throw error;
    }
  },

  async getFoods() {
    const { data, error } = await supabase
      .from('foods')
      .select('*, categories(name)')
      .order('id', { ascending: true });

    if (error) throw error;
    return data;
  },

  async uploadFoodImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('food-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data: publicUrlData } = supabase.storage
      .from('food-images')
      .getPublicUrl(filePath);

    return publicUrlData.publicUrl;
  },

  async addFood(foodData) {
    const { data, error } = await supabase
      .from('foods')
      .insert([foodData]);

    if (error) throw error;
    return data;
  },

  async updateFood(id, foodData) {
    // PELACAK 2: Cek apakah Repository menerima data dari Controller
    console.log("=== DEBUG 2: REPOSITORY MENGIRIM KE SUPABASE ===", id, foodData);

    const { data: result, error } = await supabase
      .from('foods')
      .update(foodData)
      .eq('id', id)
      .select(); // Wajib pakai .select() untuk memastikan data direturn Supabase

    if (error) {
        console.error("=== SUPABASE ERROR ===", error);
        throw error;
    }

    console.log("=== SUPABASE SUCCESS ===", result);
    return result;
  },

  async deleteFood(id) {
    const { error } = await supabase
      .from('foods')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};
