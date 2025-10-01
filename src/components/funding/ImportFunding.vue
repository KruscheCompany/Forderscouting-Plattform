<template>
  <div>
    <q-dialog v-model="dialog" persistent transition-show="scale" transition-hide="scale">
      <q-card class="import-dialog radius-20" style="width: 600px; max-width: 90vw;">
        <!-- Header -->
        <q-card-section class="dialog-header q-pb-none q-px-lg">
          <div class="text-h6 text-black q-mb-none">{{ $t('importFunding.title') }}</div>
          <q-btn flat round dense icon="close" class="text-grey-6" @click="closeDialog" />
        </q-card-section>

        <!-- Content -->
        <q-card-section class="q-px-lg q-pt-none">
          <div class="text-body2 text-grey-7 q-mb-lg">
            {{ $t('importFunding.selectFile') }}
          </div>

          <!-- Upload Area -->
          <div class="upload-area" :class="{ 'dragover': isDragover }" @click="triggerFileInput"
            @dragover.prevent="isDragover = true" @dragleave.prevent="isDragover = false"
            @drop.prevent="handleFileDrop">
            <div class="upload-content">
              <q-icon name="cloud_upload" size="48px" color="primary" class="q-mb-md" />
              <div class="text-body1 text-grey-8 q-mb-xs">
                {{ $t('importFunding.clickToUpload') }}
              </div>
              <q-btn flat color="primary" :label="$t('importFunding.chooseFile')" @click.stop="triggerFileInput"
                class="q-mt-sm" />
            </div>
          </div>

          <div class="text-caption text-grey-6 q-mt-md">
            {{ $t('importFunding.fileTypes') }} <span class="float-right">{{ $t('importFunding.maxFileSize') }}</span>
          </div>

          <!-- Uploaded Files List -->
          <div v-if="uploadedFiles.length > 0" class="q-mt-lg">
            <div class="text-body2 text-black q-mb-md">{{ $t('importFunding.uploadedFiles') }}</div>

            <div v-for="(file, index) in uploadedFiles" :key="index" class="file-item">
              <div class="file-content">
                <div class="file-header">
                  <div class="file-info">
                    <q-icon name="mdi-file-outline" size="lg" color="primary" class="q-mr-sm" />
                    <div class="file-details">
                      <div class="file-name">{{ file.name }}</div>
                      <div class="file-meta">
                        <span>{{ formatFileSize(file.size) }}</span>
                        <span v-if="file.uploading" class="text-primary q-ml-sm">
                          {{ $t('importFunding.uploading') }}
                        </span>
                        <span v-else-if="file.uploaded" class="text-positive q-ml-sm">
                          {{ $t('importFunding.complete') }}
                        </span>
                      </div>
                      <q-linear-progress v-if="uploadedFiles.some(f => f.uploading)"
                        :value="(overallProgress - 50) / 100" color="primary" class="q-mt-md radius-20" />
                    </div>
                  </div>

                  <div class="file-actions">
                    <span v-if="file.uploading" class="upload-progress">
                      {{ file.progress }}%
                    </span>
                    <q-btn flat round dense icon="mdi-delete-outline" color="grey-6" @click="removeFile(index)"
                      :disable="file.uploading" />
                  </div>
                </div>

                <div class="title-input">
                  <q-input v-model="file.title" outlined dense :label="$t('importFunding.fundingTitle')"
                    :placeholder="$t('importFunding.titlePlaceholder')" class="no-shadow input-radius-6"
                    :disable="file.uploading">
                  </q-input>
                </div>
              </div>
            </div>

          </div>
        </q-card-section>

        <!-- Actions -->
        <q-card-actions class="q-pa-lg">
          <q-btn class="radius-6 q-py-xs full-width q-ml-none" :label="$t('importFunding.import')" color="primary"
            @click="handleImport" :disable="!hasValidFiles || isUploading" :loading="isUploading" />
        </q-card-actions>

        <!-- Hidden file input -->
        <input ref="fileInput" type="file" accept=".pdf,.doc,.docx" multiple style="display: none"
          @change="handleFileSelect" />
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
export default {
  name: "ImportFunding",
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: false,
      uploadedFiles: [],
      isDragover: false,
      isUploading: false
    };
  },
  computed: {
    hasValidFiles() {
      return this.uploadedFiles.length > 0;
    },
    overallProgress() {
      if (this.uploadedFiles.length === 0) return 0;
      const totalProgress = this.uploadedFiles.reduce((sum, file) => sum + (file.progress || 0), 0);
      return Math.round(totalProgress / this.uploadedFiles.length);
    }
  },
  watch: {
    showDialog(newVal) {
      this.dialog = newVal;
      if (!newVal) {
        // Reset component state when dialog closes
        this.uploadedFiles = [];
        this.isDragover = false;
        this.isUploading = false;
      }
    }
  },
  methods: {
    closeDialog() {
      this.$emit('update:showDialog', false);
    },

    triggerFileInput() {
      this.$refs.fileInput.click();
    },

    handleFileSelect(event) {
      const files = Array.from(event.target.files);
      this.processFiles(files);
      // Reset input value to allow selecting the same file again
      event.target.value = '';
    },

    handleFileDrop(event) {
      this.isDragover = false;
      const files = Array.from(event.dataTransfer.files);
      this.processFiles(files);
    },

    processFiles(files) {
      const validFiles = files.filter(file => this.isValidFile(file));

      if (validFiles.length !== files.length) {
        this.$q.notify({
          type: 'warning',
          message: this.$t('importFunding.rejectedFiles'),
          position: 'top'
        });
      }

      validFiles.forEach(file => {
        // Check if file already exists
        const existingFile = this.uploadedFiles.find(f => f.name === file.name && f.size === file.size);
        if (!existingFile) {
          this.uploadedFiles.push({
            name: file.name,
            size: file.size,
            file: file,
            title: '', // User can customize this
            uploading: false,
            uploaded: false,
            progress: 0
          });
        }
      });
    },

    isValidFile(file) {
      const validTypes = [
        'application/pdf',
      ];

      const maxSize = 32 * 1024 * 1024; // 32MB

      return validTypes.includes(file.type) && file.size <= maxSize;
    },

    removeFile(index) {
      this.uploadedFiles.splice(index, 1);
    },

    formatFileSize(bytes) {
      if (bytes === 0) return `0 ${this.$t('importFunding.fileSizes.bytes')}`;
      const k = 1024;
      const sizes = [
        this.$t('importFunding.fileSizes.bytes'),
        this.$t('importFunding.fileSizes.kb'),
        this.$t('importFunding.fileSizes.mb'),
        this.$t('importFunding.fileSizes.gb')
      ];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    },

    async handleImport() {
      if (this.uploadedFiles.length === 0) {
        this.$q.notify({
          type: 'warning',
          message: this.$t('importFunding.selectAtLeastOneFile'),
          position: 'top'
        });
        return;
      }

      this.isUploading = true;

      try {
        // Upload files sequentially to show progress
        for (let i = 0; i < this.uploadedFiles.length; i++) {
          const fileData = this.uploadedFiles[i];
          if (!fileData.uploaded) {
            await this.uploadFile(fileData, i);
          }
        }

        this.$q.notify({
          type: 'positive',
          message: this.$t('importFunding.importSuccess'),
          position: 'top'
        });

        // Close dialog
        this.closeDialog();

      } catch (error) {
        console.error('Import failed:', error);
        this.$q.notify({
          type: 'negative',
          message: this.$t('importFunding.importError'),
          position: 'top'
        });
      } finally {
        this.isUploading = false;
      }
    },

    async uploadFile(fileData, index) {
      try {
        // Mark as uploading
        this.$set(this.uploadedFiles[index], 'uploading', true);
        this.$set(this.uploadedFiles[index], 'progress', 0);

        // Call store action with progress callback
        const response = await this.$store.dispatch('ai/uploadFundingFile', {
          fileData,
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            this.$set(this.uploadedFiles[index], 'progress', progress);
          }
        });

        // Mark as completed
        this.$set(this.uploadedFiles[index], 'uploading', false);
        this.$set(this.uploadedFiles[index], 'uploaded', true);
        this.$set(this.uploadedFiles[index], 'progress', 100);
        this.$set(this.uploadedFiles[index], 'response', response.data);

        return response;
      } catch (error) {
        // Mark as failed
        this.$set(this.uploadedFiles[index], 'uploading', false);
        this.$set(this.uploadedFiles[index], 'uploaded', false);
        this.$set(this.uploadedFiles[index], 'progress', 0);

        this.$q.notify({
          type: 'negative',
          message: this.$t('importFunding.uploadError', { fileName: fileData.name, error: error.message }),
          position: 'top'
        });

        throw error;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.import-dialog {
  .dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .upload-area {
    border: 2px dashed #e0e0e0;
    border-radius: 8px;
    padding: 48px 24px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fafafa;

    &:hover,
    &.dragover {
      border-color: #1976d2;
      background-color: #f3f8ff;
    }

    .upload-content {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  .file-item {
    border: 1px dashed #e0e0e0;
    border-radius: 6px;
    margin-bottom: 12px;
    background-color: transparent;
    overflow: hidden;

    .file-content {
      padding: 12px 16px;
    }

    .file-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .file-info {
      display: flex;
      align-items: center;
      flex: 1;

      .file-details {
        flex: 12;

        .file-name {
          font-weight: 500;
          color: #333;
          margin-bottom: 2px;
        }

        .file-meta {
          font-size: 12px;
          color: #666;
        }
      }
    }

    .file-actions {
      display: flex;
      align-items: center;

      .upload-progress {
        font-size: 12px;
        color: #1976d2;
        margin-right: 8px;
        font-weight: 500;
      }
    }

    .title-input {
      border-top: 1px solid #e0e0e0;
      margin: 12px -16px -12px -16px;
      padding: 12px 16px 12px 16px;
      background-color: $blue-1;
    }
  }
}
</style>
