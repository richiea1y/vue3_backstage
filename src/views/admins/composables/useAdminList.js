import { getAdminMembers } from '@/service/api';
import { ref } from 'vue';
import { useLogger } from '@/composables/useLogger';

export function useAdminList() {
  const admins = ref([]);
  const loading = ref(false);
  const logger = useLogger({ prefix: '[useAdminList]', enabled: import.meta.env.DEV });

  const fetchAdmins = async () => {
    loading.value = true;
    try {
      const response = await getAdminMembers();
      logger.info('Get Admin API Response:', response);

      // 後端回傳格式：{ Code, Msg, Data, TotalCount }
      // 注意：Data 是大寫
      const payload = response.data?.Data || [];

      admins.value = Array.isArray(payload) ? payload : [];
      logger.info('Fetched admins:', admins.value);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      logger.error('Failed to fetch admins:', error);
      admins.value = []; // 確保錯誤時也是空陣列
    } finally {
      loading.value = false;
    }
  };

  return {
    admins,
    loading,
    fetchAdmins
  };
}
