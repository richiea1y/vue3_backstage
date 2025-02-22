import { ref, onMounted, computed, nextTick } from 'vue'
import to from 'await-to-js'
import { getGoodsList } from '@/service/api'

export function useGoodsList() {

  const tableData = ref([])
  const tableLoading = ref(false)

  const searchFilter = ref({
    ID: 0,
    GoodsName: '',
    GoodsType: 0
  })

  const lastFilter = ref({ ...searchFilter.value })

  const pagination = ref({
    currentPage: 0,
    pageSize: 20,
    total: 0
  })

  /** Goods list request */

  const getGoodsListRequest = async (useLastFilter = false) => {
    tableLoading.value = true
    const currentFilter = useLastFilter ? lastFilter.value : searchFilter.value

    const requestData = {
      ...currentFilter,
      Page: pagination.value.currentPage,
      PageLimit: pagination.value.pageSize
    }

    const [err, res] = await to(getGoodsList(requestData))
    tableLoading.value = false
    if (res.data.Code !== 200) {
      console.error(err)
      return
    }
    console.log('RES: ', res)
    tableData.value = res.data.Data
    lastFilter.value = { ...searchFilter.value }
  }

  return {
    tableData,
    tableLoading,
    getGoodsListRequest
  }
}