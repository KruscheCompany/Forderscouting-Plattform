<template>
  <q-card class="shadow-2 radius-10 bg-blue-1 q-pa-md">
    <q-card-section horizontal class="">
      <div class="col">
        <q-img
          class="radius-10"
          spinner-color="primary"
          src="https://imgs.search.brave.com/fDp0hsTsmFdZl8vlDpOeUXONfJKCvDcbcMhJYEqDEWk/rs:fit:399:600:1/g:ce/aHR0cDovLzEuYnAu/YmxvZ3Nwb3QuY29t/Ly0tMWVCb1VqcnR1/SS9UZ0MxTmdUNEg2/SS9BQUFBQUFBQUIw/WS8xNjBlZkNQUkRk/cy9zMTYwMC9DdXN0/b21pemUrWW91citG/YWNlYm9vaytQcm9m/aWxlK3dpdGgrQmVh/dXRpZnVsK0dpcmxz/KyUyNTI4NCUyNTI5/LmpwZw"
          style="height: 100px; max-width: 100px"
        />
      </div>
      <div class="col-8 font-16" :class="$q.screen.lg ? 'q-pl-md' : ''">
        <div class="row q-mb-md">
          <div class="col-12">
            <p class="font-24 no-margin">Talan Herwitz</p>
          </div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 text-blue-grey-10 text-overflow">
            <p class="no-margin">Administration:</p>
          </div>
          <div class="col-7 q-ml-md">Municipality name</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 font-16 text-blue-grey-10 text-overflow">
            <p class="no-margin">Location:</p>
          </div>
          <div class="col-7 q-ml-md">Erlangen</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 font-16 text-blue-grey-10 text-overflow">
            <p class="no-margin">Email:</p>
          </div>
          <div class="col-7 q-ml-md">talan.herwitz@mail.com</div>
        </div>
        <div class="row q-mb-md">
          <div class="col-4 font-16 text-blue-grey-10 text-overflow">
            <p class="no-margin">Telefon:</p>
          </div>
          <div class="col-7 q-ml-md">0251 7764-113</div>
        </div>
      </div>
      <div class="col-1">
        <q-btn
          icon="img:/icons/Unfollow.svg"
          flat
          round
          color="primary"
        ></q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
export default {};
</script>

<style></style>
