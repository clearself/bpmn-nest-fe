import { reactive } from 'vue'
import * as service from './service'

export const store = reactive({
  // 所属组织
  supplierList: [],
  ghg: [],
  iso: [],
  standarUnitList: [],
  // 活动数据单位
  // activityDataUnitList: [],
  // 活动数据类别
  activityDataTypeList: [],
  // 排放因子类别
  emissionFactorTypeList: [],
  // publishYear 发布年份
  publishYearList: [],
  // 一级分类
  firstClassifyList: [],
  // 源语言
  originLanguageList: [],
  // 来源类别
  sourceClassifyList: [],
  // 用户所属组织
  userDeptList: [],
  // 用户角色
  userRoleList: [],
  // 功能菜单
  menuList: [],
  // 单位
  unitList: [],
  // 单位类型
  unitTypeList: [],
  // 操作模块
  opModuleList: [],
  // 操作模块
  assignUserList: [],
  // 审核流程
  processStepList: {
    processVO: [],
    stepVO: []
  },

  /**
   * ************************************
   */

  // indicator
  isSupplierListInited: false,
  isSupplierListIniting: false,
  isGhgListInited: false,
  isGhgListIniting: false,
  isIsoListInited: false,
  isIsoistIniting: false,
  isStandarUnitListInited: false,
  isStandarUnitListIniting: false,
  // isActivityDataUnitListInited: false,
  // isActivityDataUnitListIniting: false,
  isActivityDataTypeListInited: false,
  isActivityDataTypeListIniting: false,
  isEmissionFactorTypeListInited: false,
  isEmissionFactorTypeListIniting: false,
  isPublishYearListInited: false,
  isPublishYearListIniting: false,
  isFirstClassifyListInited: false,
  isFirstClassifyListIniting: false,
  isOriginLanguageListInited: false,
  isOriginLanguageListIniting: false,
  isSourceClassifyListInited: false,
  isSourceClassifyListIniting: false,
  isUserDeptListInited: false,
  isUserDeptListIniting: false,
  isUserRoleListInited: false,
  isUserRoleListIniting: false,
  isMenuListInited: false,
  isMenuListIniting: false,
  isUnitListInited: false,
  isUnitListIniting: false,
  isUnitTypeListInited: false,
  isUnitTypeListIniting: false,
  isOpModuleListInited: false,
  isOpModuleListIniting: false,
  isAssignUserListInited: false,
  isAssignUserListIniting: false,
  isProcessStepListInited: false,
  isProcessStepListIniting: false,

  async init(mArr: string[], needUpdate = true) {
    for (const m of mArr) {
      // 只有需要调试时才打开这个输出
      // console.log("---m: ", m);
      if (needUpdate && (this as any)[`is${m}Inited`] !== undefined) {
        ;(this as any)[`is${m}Inited`] = false
        // (this as any)[`is${m}Initing`] = false;
      }
      await (this as any)[`init${m}`]()
      // console.log("ftf".repeat(10));
    }
    // await this.initGhg();
    // await this.initIso();
    // await this.initStandarUnitList();
    // // await this.initActivityDataUnitList();
    // await this.initActivityDataTypeList();
    // await this.initEmissionFactorTypeList();
    // await this.initPublishYearList();
  },
  async initSupplierList() {
    if (this.isSupplierListIniting || this.isSupplierListInited) {
      return
    }
    this.isSupplierListIniting = true
    const res = await service.getAllSupplier()
    // console.log("ghg res: ", res);
    if (res.code === '0') {
      this.supplierList = res.result
      this.isSupplierListIniting = false
      this.isSupplierListInited = true
    }
  },
  async initGhg() {
    if (this.isGhgListIniting || this.isGhgListInited) {
      return
    }
    this.isGhgListIniting = true
    const res = await service.getAllGhg()
    // console.log("ghg res: ", res);
    if (res.code === '0') {
      this.ghg = res.result
      this.isGhgListIniting = false
      this.isGhgListInited = true
    }
  },
  async initIso() {
    if (this.isIsoistIniting || this.isIsoListInited) {
      return
    }
    this.isIsoistIniting = true
    const res = await service.getAllIso()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.iso = res.result
      this.isIsoistIniting = false
      this.isIsoListInited = true
    }
  },
  async initStandarUnitList() {
    if (this.isStandarUnitListIniting || this.isStandarUnitListInited) {
      return
    }
    this.isStandarUnitListIniting = true
    const res = await service.getAllStandarUnit()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.standarUnitList = res.result
      this.isStandarUnitListIniting = false
      this.isStandarUnitListInited = true
    }
  },
  async initActivityDataTypeList() {
    if (this.isActivityDataTypeListIniting || this.isActivityDataTypeListInited) {
      return
    }
    this.isActivityDataTypeListIniting = true
    const res = await service.getAllactivityDataType()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.activityDataTypeList = res.result
      this.isActivityDataTypeListIniting = false
      this.isActivityDataTypeListInited = true
    }
  },
  async initEmissionFactorTypeList() {
    if (this.isEmissionFactorTypeListIniting || this.isEmissionFactorTypeListInited) {
      return
    }
    this.isEmissionFactorTypeListIniting = true
    const res = await service.getAllEmissionFactorType()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.emissionFactorTypeList = res.result
      this.isEmissionFactorTypeListIniting = false
      this.isEmissionFactorTypeListInited = true
    }
  },
  async initPublishYearList() {
    if (this.isPublishYearListIniting || this.isPublishYearListInited) {
      return
    }
    this.isPublishYearListIniting = true
    const res = await service.getAllPublicYear()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.publishYearList = res.result.map((_: any) => ({
        label: _,
        value: _
      }))
      this.isPublishYearListIniting = false
      this.isPublishYearListInited = true
    }
  },
  async initFirstClassifyList() {
    if (this.isFirstClassifyListIniting || this.isFirstClassifyListInited) {
      return
    }
    this.isFirstClassifyListIniting = true
    const res = await service.getAllFirstClassify()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.firstClassifyList = res.result
      this.isFirstClassifyListIniting = false
      this.isFirstClassifyListInited = true
    }
  },
  async initOriginLanguageList() {
    if (this.isOriginLanguageListIniting || this.isOriginLanguageListInited) {
      return
    }
    this.isOriginLanguageListIniting = true
    const res = await service.getAllOriginLanguage()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.originLanguageList = res.result
      this.isOriginLanguageListIniting = false
      this.isOriginLanguageListInited = true
    }
  },
  async initSourceClassifyList() {
    if (this.isSourceClassifyListIniting || this.isSourceClassifyListInited) {
      return
    }
    this.isSourceClassifyListIniting = true
    const res = await service.getAllSourceClassify()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.sourceClassifyList = res.result
      this.isSourceClassifyListIniting = false
      this.isSourceClassifyListInited = true
    }
  },
  async initUserDeptList() {
    // console.log("-----------initUserDeptList-----------");

    if (this.isUserDeptListInited || this.isUserDeptListIniting) {
      return
    }
    this.isUserDeptListInited = true
    const res = await service.getAllDept()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.userDeptList = res.result.records
      this.isUserDeptListInited = true
      this.isUserDeptListIniting = false
    }
  },
  async initUserRoleList() {
    if (this.isUserRoleListInited || this.isUserRoleListIniting) {
      return
    }
    this.isUserRoleListInited = true
    const res = await service.getAllRole()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      if (Array.isArray(res.result)) {
        this.userRoleList = res.result
      }
      this.isUserRoleListInited = true
      this.isUserRoleListIniting = false
    }
  },
  async initMenuList() {
    if (this.isMenuListInited || this.isMenuListIniting) {
      return
    }
    this.isMenuListInited = true
    const res = await service.getAllMenu()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.menuList = res.result
      this.isMenuListInited = true
      this.isMenuListIniting = false
    }
  },
  async initUnitList() {
    if (this.isUnitListInited || this.isUnitListIniting) {
      return
    }
    this.isUnitListInited = true
    const res = await service.getAllUnit()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.unitList = res.result
      this.isUnitListInited = true
      this.isUnitListIniting = false
    }
  },
  async initUnitTypeList() {
    if (this.isUnitTypeListInited || this.isUnitTypeListIniting) {
      return
    }
    this.isUnitTypeListInited = true
    const res = await service.getAllUnitType()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.unitTypeList = res.result
      this.isUnitTypeListInited = true
      this.isUnitTypeListIniting = false
    }
  },
  // TODO: todo it lately when api is rerady
  async initOpModulesList() {
    if (this.isOpModuleListInited || this.isOpModuleListIniting) {
      return
    }
    this.isOpModuleListInited = true
    const res = await service.getAllOpModule()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.opModuleList = res.result
      this.isOpModuleListInited = true
      this.isOpModuleListIniting = false
    }
  },
  async initAssignUserList() {
    if (this.isAssignUserListInited || this.isAssignUserListIniting) {
      return
    }
    this.isAssignUserListInited = true
    const res = await service.getAllAssignUser()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.assignUserList = res.result
      this.isAssignUserListInited = true
      this.isAssignUserListIniting = false
    }
  },
  async initProcessStepList() {
    if (this.isProcessStepListInited || this.isProcessStepListIniting) {
      return
    }
    this.isProcessStepListInited = true
    const res = await service.getAllProcessStep()
    // console.log("iso res: ", res);
    if (res.code === '0') {
      this.processStepList = res.result
      this.isProcessStepListInited = true
      this.isProcessStepListIniting = false
    }
  }
})
