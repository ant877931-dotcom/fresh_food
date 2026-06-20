import { supabase } from '../config/supabase.js';

export const categoryRepository = {
  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
    return data;
  },

  async addCategory(name) {
    const { data, error } = await supabase
      .from('categories')
      .insert([{ name }]);

    if (error) {
      console.error('Error adding category:', error);
      throw error;
    }
    return data;
  },

  async deleteCategory(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
    return true;
  },

  async updateCategory(id, newName) {
    const { data, error } = await supabase
      .from('categories')
      .update({ name: newName })
      .eq('id', id);

    if (error) {
      console.error('Error updating category:', error);
      throw error;
    }
    return data;
  }
};
