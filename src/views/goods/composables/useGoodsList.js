import { ref, onMounted, computed, nextTick } from 'vue'
import to from 'await-to-js'
import { getGoodsList, getGoodsType } from '@/service/api'

export function useGoodsList() {

  const tableData = ref([])
  const tableLoading = ref(false)

  /** 搜尋 UI 應綁定的對象在這 */
  const searchFilter = ref({
    ID: 0,
    GoodsName: '',
    GoodsType: null
  })

  const lastSearchFilter = ref({ ...searchFilter.value })

  const pagination = ref({
    currentPage: 1,
    pageSize: 20,
    total: 0
  })

  /** 新增與編輯商品用的表單 */
  const goodsForm = ref({
    ID: null,
    Show: true,
    GoodsTypeID: 0,
    Name: '',
    SpecsAllowance: 0,
    GoodsSpecs: [],
    UnitPrice: 0,
    ImagesIdnet: '',
    Description: ''
  })

  const goodsTypeList = ref([])

  /** Goods Type List request */

  const getGoodsTypeList = async () => {
    const [err, res] = await to(getGoodsType({}))
    if (res.data.Code !== 200) {
      console.error(err)
      return
    }
    goodsTypeList.value = res.data.Data
    console.log('### GOODS TYPE RES: ', goodsTypeList.value)
  }

  /** Goods list request */

  const getGoodsListRequest = async (useLastSearchForm = false) => {
    tableLoading.value = true
    const currentFilter = useLastSearchForm ? lastSearchFilter.value : searchFilter.value

    /** 一定要有預設值，ID和TYPE沒給值的部分就轉為 0 */
    const requestData = {
      ID: currentFilter.ID || 0,
      GoodsName: currentFilter.GoodsName || '',
      GoodsType: currentFilter.GoodsType || 0,
      Page: pagination.value.currentPage,
      PageLimit: pagination.value.pageSize
    }

    console.log('### GOODS LIST PAYLOAD: ', requestData)

    const [err, res] = await to(getGoodsList(requestData))
    tableLoading.value = false
    if (res.data.Code !== 200) {
      console.error(err)
      return
    }

    tableData.value = res.data.Data
    pagination.value.total = res.data.TotalCount
    lastSearchFilter.value = { ...searchFilter.value }
    console.log('### GOODS LIST RES: ', tableData.value)
  }

  return {
    searchFilter,
    tableData,
    pagination,
    tableLoading,
    goodsForm,
    goodsTypeList,
    getGoodsListRequest,
    getGoodsTypeList
  }
}