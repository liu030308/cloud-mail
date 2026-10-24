<template>
  <emailScroll ref="scroll"
               :cancel-success="cancelStar"
               :star-success="addStar"
               :getEmailList="getEmailList"
               :emailDelete="emailDelete"
               :star-add="starAdd"
               :star-cancel="starCancel"
               :email-read="emailRead"
               :show-unread="true"
               :highlight-text="emailStore.searchParams.text"
               actionLeft="4px"
               @jump="jumpContent"
  >
  </emailScroll>
</template>

<script setup>
import {useAccountStore} from "@/store/account.js";
import {useEmailStore} from "@/store/email.js";
import {useSettingStore} from "@/store/setting.js";
import emailScroll from "@/components/email-scroll/index.vue"
import {emailList, emailDelete, emailLatest, emailRead} from "@/request/email.js";
import {starAdd, starCancel} from "@/request/star.js";
import {defineOptions, h, onMounted, onUnmounted, reactive, ref, watch} from "vue";
import {sleep} from "@/utils/time-utils.js";
import router from "@/router/index.js";
import { useRoute } from 'vue-router'
import {useI18n} from 'vue-i18n'
import {backgroundPushEnabled, notificationEnabled, showMailNotification} from '@/utils/notification-utils.js'

defineOptions({
  name: 'email'
})

const route = useRoute();
const {t} = useI18n();
const emailStore = useEmailStore();
const accountStore = useAccountStore();
const settingStore = useSettingStore();
const scroll = ref({})
onMounted(() => {
  emailStore.emailScroll = scroll;
  latest()
})


watch(() => accountStore.currentAccountId, () => {
  scroll.value.refreshList();
})

watch(
  () => emailStore.searchParams,
  () => {
    scroll.value.refreshList()
  },
  {deep: true}
)

function jumpContent(email) {
  emailStore.contentData.email = emailStore.toContentEmail(email)
  emailStore.contentData.delType = 'logic'
  emailStore.contentData.showUnread = true
  emailStore.contentData.showStar = true
  emailStore.contentData.showReply = true
  router.push({name: 'content', params: {mailbox: 'inbox'}})
}

const existIds = new Set();
let polling = true;
let failureDelay = 0;

onUnmounted(() => {
  polling = false;
});

async function latest() {
  while (polling) {

    let autoRefresh = settingStore.settings.autoRefresh;
    await sleep((autoRefresh > 1 ? autoRefresh * 1000 : 3000) + failureDelay);

    if (!polling || route.name !== 'email' || (document.hidden && (backgroundPushEnabled() || !notificationEnabled()))) {
      continue;
    }

    const searchParams = emailStore.searchParams
    if (searchParams.text || searchParams.startDate || searchParams.endDate) {
      continue
    }

    const latestId = scroll.value.latestEmail?.emailId

    if (!scroll.value.firstLoad && autoRefresh > 1) {
      try {
        const accountId = accountStore.currentAccountId
        const allReceive = scroll.value.latestEmail?.allReceive
        let list = []
		failureDelay = 0

        //确保发起请求时最后一个邮件是当前账号的,或者
        if (accountId === scroll.value.latestEmail?.reqAccountId) {
          list = await emailLatest(latestId, accountId, allReceive);
        }

        //确保请求回来后，账号没有切换，时间排序没有改变，全部邮件类型没变
        if (accountId === accountStore.currentAccountId && allReceive === accountStore.currentAccount.allReceive) {
          if (list.length > 0) {
            emailStore.applyFullList(list)

            for (let email of list) {

              email.reqAccountId = accountId;
              email.allReceive = allReceive;

              if (!existIds.has(email.emailId)) {

                existIds.add(email.emailId)
                scroll.value.addItem(email)
                await showMailNotification(email, t('newMailNotification'), t('noSubject'))

                await sleep(50)
              }

            }

          }

        }
      } catch (e) {
		failureDelay = Math.min(failureDelay ? failureDelay * 2 : 2000, 60000)
        if (e.code === 401 || e.code === 403) {
          settingStore.settings.autoRefresh = 0;
        }
        console.error(e)
      }
    }
  }
}

function addStar(email) {
  emailStore.starScroll?.addItem(email)
}

function cancelStar(email) {
  emailStore.starScroll?.deleteEmail([email.emailId])
}

function getEmailList(emailId, size) {
  const accountId =  accountStore.currentAccountId;
  const allReceive = accountStore.currentAccount.allReceive;
  return emailStore.fetchList(full =>
    emailList(accountId, allReceive, emailId, 0, size, 0, full, emailStore.searchParams)
  ).then(data => {
    data.latestEmail.reqAccountId = accountId;
    data.latestEmail.allReceive = allReceive;
    return data;
  })
}

</script>
<style>
.icon {
  cursor: pointer;
}
</style>
