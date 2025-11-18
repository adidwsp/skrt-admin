<template>
    <div
      class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800"
    >
      <!-- Header Sticky -->
      <div class="top-0 z-40 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center space-x-3">
            <div class="flex-shrink-0">
              <div class="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                </svg>
              </div>
            </div>
            <div>
              <h1 class="text-xl font-semibold text-gray-900 dark:text-white">Ticket Management</h1>
              <p class="text-sm text-gray-500 dark:text-gray-400">Manage all event tickets in one place</p>
            </div>
          </div>
          <div class="mt-4 sm:mt-0 flex items-center space-x-3">
            <div class="relative">
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search tickets..."
                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 w-full sm:w-64"
              >
              <div class="absolute left-3 top-2.5">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </div>
            </div>
            <button
              @click="refreshTickets"
              class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              :disabled="loading"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      

      <!-- Table Container dengan Header Sticky yang Fixed -->
      <div class="relative max-w-full overflow-x-auto custom-scrollbar" style="max-height: calc(100vh - 280px);">
        <table class="min-w-full whitespace-nowrap">
          <thead class="bg-gray-50 dark:bg-gray-700 sticky top-0 z-30 shadow-sm">
            <tr class="border-b border-gray-200 dark:border-gray-600">
              <th class="left-0 z-40 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left border-r border-gray-200 dark:border-gray-600">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">No.</p>
              </th>
              <th class="px-4 py-3 text-left min-w-[180px]">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Attendee</p>
              </th>
              <th class="px-4 py-3 text-left min-w-[200px] hidden lg:table-cell">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Email</p>
              </th>
              <th class="px-4 py-3 text-left min-w-[140px] hidden md:table-cell">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Phone</p>
              </th>
              <th class="px-4 py-3 text-left min-w-[150px]">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Ticket No.</p>
              </th>
              <th class="px-4 py-3 text-left min-w-[120px]">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Status</p>
              </th>
              <th class="px-4 py-3 text-left min-w-[120px] hidden xl:table-cell">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">University</p>
              </th>
              <th class="px-4 py-3 text-left min-w-[100px] hidden 2xl:table-cell">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Donation</p>
              </th>
              <th class="right-0 z-40 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-left min-w-[100px] border-l border-gray-200 dark:border-gray-600">
                <p class="font-medium text-gray-500 text-theme-xs dark:text-gray-400">Actions</p>
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
            <tr 
              v-for="(ticket, index) in filteredTickets" 
              :key="ticket.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer group"
              @click="viewTicketDetail(ticket)"
            >
              <!-- No. Column - Sticky -->
              <td class="left-0 z-30 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 px-4 py-3 text-theme-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
                {{ index + 1 }}
              </td>

              <!-- Attendee Column -->
              <td class="px-4 py-3">
                <div class="flex flex-col">
                  <p class="text-theme-sm font-medium text-gray-900 dark:text-white">
                    {{ ticket.name || 'No Name' }}
                  </p>
                  <div class="flex items-center space-x-2 mt-1">
                    <span class="inline-flex px-2 py-0.5 text-theme-xs rounded-md capitalize"
                      :class="genderClasses(ticket.gender)">
                      {{ ticket.gender || '-' }}
                    </span>
                    <span v-if="ticket.is_student" class="inline-flex items-center px-2 py-0.5 text-theme-xs rounded-md bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/>
                      </svg>
                      Student
                    </span>
                  </div>
                  <p class="text-theme-xs text-gray-500 dark:text-gray-400 mt-1 lg:hidden">
                    {{ ticket.email || '-' }}
                  </p>
                </div>
              </td>

              <!-- Email Column - Hidden on mobile -->
              <td class="px-4 py-3 hidden lg:table-cell">
                <p class="text-theme-sm text-gray-900 dark:text-white truncate max-w-[180px]" :title="ticket.email">
                  {{ ticket.email || '-' }}
                </p>
              </td>

              <!-- Phone Column - Hidden on mobile -->
              <td class="px-4 py-3 hidden md:table-cell">
                <p class="text-theme-sm text-gray-900 dark:text-white">
                  {{ ticket.phone || '-' }}
                </p>
              </td>

              <!-- Ticket Number Column -->
              <td class="px-4 py-3">
                <p class="text-theme-sm font-mono font-medium text-blue-600 dark:text-blue-400">
                  {{ ticket.ticket_number || '-' }}
                </p>
              </td>

              <!-- Status Column -->
              <td class="px-4 py-3">
                <span 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-theme-xs font-medium capitalize"
                  :class="statusClasses(ticket.is_scanned)"
                >
                  <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="ticket.is_scanned" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ ticket.is_scanned ? 'Scanned' : 'Pending' }}
                </span>
              </td>

              <!-- University Column - Hidden on mobile -->
              <td class="px-4 py-3 hidden xl:table-cell">
                <p class="text-theme-sm text-gray-900 dark:text-white truncate max-w-[140px]" :title="ticket.university">
                  {{ ticket.university || '-' }}
                </p>
              </td>

              <!-- Donation Column - Hidden on mobile -->
              <td class="px-4 py-3 hidden 2xl:table-cell">
                <p class="text-theme-sm font-medium text-gray-900 dark:text-white">
                  Rp {{ formatCurrency(ticket.donation_amount || 0) }}
                </p>
              </td>

              <!-- Actions Column - Sticky -->
              <td class="right-0 z-30 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 px-4 py-3 border-l border-gray-200 dark:border-gray-600">
                <div class="flex items-center space-x-1">
                  <!-- Edit Button -->
                  <button
                    @click.stop="editTicket(ticket)"
                    class="p-1.5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                    :disabled="loading"
                    title="Edit Ticket"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                    </svg>
                  </button>

                  <!-- Delete Button -->
                  <button
                    @click.stop="confirmDelete(ticket)"
                    class="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors duration-200 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    :disabled="loading"
                    title="Delete Ticket"
                  >
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredTickets.length === 0" class="text-center py-12">
          <div class="flex flex-col items-center justify-center">
            <svg class="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No tickets found</h3>
            <p class="text-gray-500 dark:text-gray-400">
              {{ searchQuery ? 'No tickets match your search.' : 'There are no tickets in the database yet.' }}
            </p>
            <button
              v-if="searchQuery"
              @click="searchQuery = ''"
              class="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Clear search
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="showDetailModal"
      class="fixed inset-0 z-[100] overflow-y-auto mt-16"
      @click="showDetailModal = false"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div
          class="relative inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6"
          @click.stop
        >
          <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
            <button
              type="button"
              class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              @click="showDetailModal = false"
            >
              <span class="sr-only">Close</span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div class="sm:flex sm:items-start">
            <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-blue-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Ticket Details
              </h3>
              <div class="mt-4">
                <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Personal Information</h4>
                    <dl class="mt-2 space-y-2">
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Full Name</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTicket?.name || '-' }}</dd>
                      </div>
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Gender</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTicket?.gender || '-' }}</dd>
                      </div>
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Email</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTicket?.email || '-' }}</dd>
                      </div>
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Phone</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTicket?.phone || '-' }}</dd>
                      </div>
                    </dl>
                  </div>
                  
                  <div>
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Information</h4>
                    <dl class="mt-2 space-y-2">
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Ticket Number</dt>
                        <dd class="text-sm font-mono font-medium text-blue-600 dark:text-blue-400">{{ selectedTicket?.ticket_number || '-' }}</dd>
                      </div>
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Status</dt>
                        <dd>
                          <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize"
                            :class="statusClasses(selectedTicket?.is_scanned ?? false)">
                            {{ selectedTicket?.is_scanned ? 'Scanned' : 'Pending Scan' }}
                          </span>
                        </dd>
                      </div>
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">University</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTicket?.university || '-' }}</dd>
                      </div>
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Student</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTicket?.is_student ? 'Yes' : 'No' }}</dd>
                      </div>
                    </dl>
                  </div>

                  <div v-if="selectedTicket?.address" class="sm:col-span-2">
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Address</h4>
                    <p class="mt-1 text-sm text-gray-900 dark:text-white">{{ selectedTicket.address }}</p>
                  </div>

                  <div class="sm:col-span-2">
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Additional Information</h4>
                    <dl class="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">With Child</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTicket?.with_child ? 'Yes' : 'No' }}</dd>
                      </div>
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Number of Children</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTicket?.num_of_children || 0 }}</dd>
                      </div>
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Donation Amount</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">Rp {{ formatCurrency(selectedTicket?.donation_amount || 0) }}</dd>
                      </div>
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Donation Bank</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ selectedTicket?.donation_bank || '-' }}</dd>
                      </div>
                    </dl>
                  </div>

                  <div class="sm:col-span-2">
                    <h4 class="text-sm font-medium text-gray-500 dark:text-gray-400">Timestamps</h4>
                    <dl class="mt-2 grid grid-cols-2 gap-4">
                      <div>
                        <dt class="text-xs text-gray-500 dark:text-gray-400">Created At</dt>
                        <dd class="text-sm font-medium text-gray-900 dark:text-white">{{ formatDateTime(selectedTicket?.created_at?? '') }}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="showDetailModal = false"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Modal -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 z-[100] overflow-y-auto"
      @click="showEditModal = false"
    >
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div
          class="relative inline-block w-full max-w-md px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6"
          @click.stop
        >
          <div class="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
            <button
              type="button"
              class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              @click="showEditModal = false"
            >
              <span class="sr-only">Close</span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <div>
            <div class="flex items-center justify-center w-12 h-12 mx-auto bg-blue-100 rounded-full">
              <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-5">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Edit Ticket
              </h3>
            </div>
          </div>

          <form @submit.prevent="updateTicket" class="mt-4 max-h-96 overflow-y-auto pr-2 -mr-2 modal-scrollbar">
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name *
                </label>
                <input
                  v-model="editForm.name"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email *
                </label>
                <input
                  v-model="editForm.email"
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone
                  </label>
                  <input
                    v-model="editForm.phone"
                    type="text"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Gender
                  </label>
                  <select
                    v-model="editForm.gender"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  University
                </label>
                <input
                  v-model="editForm.university"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Ticket Number
                </label>
                <input
                  v-model="editForm.ticket_number"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Donation Amount
                </label>
                <input
                  v-model="editForm.donation_amount"
                  type="number"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
              </div>

              <div class="flex items-center">
                <input
                  v-model="editForm.is_scanned"
                  type="checkbox"
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Ticket Scanned</span>
              </div>
            </div>

            <div class="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                @click="showEditModal = false"
                class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                :disabled="loading"
              >
                Cancel
              </button>
              <button
                type="submit"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                :disabled="loading"
              >
                {{ loading ? 'Updating...' : 'Update' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-[100] overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
        
        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        
        <div
          class="relative inline-block w-full max-w-md px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6"
        >
          <div class="sm:flex sm:items-start">
            <div class="flex items-center justify-center flex-shrink-0 w-12 h-12 mx-auto bg-red-100 rounded-full sm:mx-0 sm:h-10 sm:w-10">
              <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
              </svg>
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Delete Ticket
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete the ticket for <strong>{{ deleteTicketData?.name || 'this attendee' }}</strong>? This action cannot be undone.
                </p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="deleteTicket"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              :disabled="loading"
            >
              {{ loading ? 'Deleting...' : 'Delete' }}
            </button>
            <button
              type="button"
              @click="showDeleteModal = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600 sm:mt-0 sm:w-auto sm:text-sm"
              :disabled="loading"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed } from 'vue'
import { supabase } from '../../../utils/supabase'

interface Ticket {
  id: string
  name: string
  gender: string
  address: string
  university: string
  phone: string
  email: string
  created_at: string
  num_of_children: number
  is_student: boolean
  with_child: boolean
  ticket_number: string
  donation_amount: number
  donation_bank: string
  donation_proof_path: string
  is_scanned: boolean
}

const tickets = ref<Ticket[]>([])
const loading = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const searchQuery = ref('')

const selectedTicket = ref<Ticket | null>(null)
const editForm = reactive({
  id: '',
  name: '',
  gender: '',
  university: '',
  phone: '',
  email: '',
  ticket_number: '',
  donation_amount: 0,
  is_scanned: false
})

const deleteTicketData = ref<Ticket | null>(null)

// Computed properties
const filteredTickets = computed(() => {
  if (!searchQuery.value) return tickets.value
  
  const query = searchQuery.value.toLowerCase()
  return tickets.value.filter(ticket => 
    ticket.name?.toLowerCase().includes(query) ||
    ticket.email?.toLowerCase().includes(query) ||
    ticket.ticket_number?.toLowerCase().includes(query) ||
    ticket.university?.toLowerCase().includes(query) ||
    ticket.phone?.toLowerCase().includes(query)
  )
})

const totalDonation = computed(() => {
  return filteredTickets.value.reduce((sum, ticket) => sum + (ticket.donation_amount || 0), 0)
})

// Fungsi untuk menentukan kelas status - PERBAIKAN: parameter wajib boolean
const statusClasses = (isScanned: boolean) => {
  return isScanned 
    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
}

// Fungsi untuk menentukan kelas gender - PERBAIKAN: parameter wajib string
const genderClasses = (gender: string) => {
  switch (gender?.toLowerCase()) {
    case 'male':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'female':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

// Format currency - PERBAIKAN: parameter wajib number
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

// Format date and time - PERBAIKAN: parameter wajib string
const formatDateTime = (dateString: string) => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleString('id-ID', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// View ticket detail
const viewTicketDetail = (ticket: Ticket) => {
  selectedTicket.value = ticket
  showDetailModal.value = true
}

// Edit Ticket
const editTicket = (ticket: Ticket) => {
  editForm.id = ticket.id
  editForm.name = ticket.name || ''
  editForm.gender = ticket.gender || ''
  editForm.university = ticket.university || ''
  editForm.phone = ticket.phone || ''
  editForm.email = ticket.email || ''
  editForm.ticket_number = ticket.ticket_number || ''
  editForm.donation_amount = ticket.donation_amount || 0
  editForm.is_scanned = ticket.is_scanned || false
  showEditModal.value = true
}

// Update Ticket
const updateTicket = async () => {
  if (!editForm.id) return

  loading.value = true
  try {
    const { error } = await supabase
      .from('tickets')
      .update({
        name: editForm.name,
        gender: editForm.gender,
        university: editForm.university,
        phone: editForm.phone,
        email: editForm.email,
        ticket_number: editForm.ticket_number,
        donation_amount: editForm.donation_amount,
        is_scanned: editForm.is_scanned,
        updated_at: new Date().toISOString()
      })
      .eq('id', editForm.id)

    if (error) throw error

    // Update local data
    const index = tickets.value.findIndex(t => t.id === editForm.id)
    if (index !== -1) {
      tickets.value[index] = { ...tickets.value[index], ...editForm }
    }

    showEditModal.value = false
  } catch (error) {
    console.error('Error updating ticket:', error)
    alert('Error updating ticket. Please try again.')
  } finally {
    loading.value = false
  }
}

// Confirm Delete
const confirmDelete = (ticket: Ticket) => {
  deleteTicketData.value = ticket
  showDeleteModal.value = true
}

// Delete Ticket
const deleteTicket = async () => {
  if (!deleteTicketData.value) return

  loading.value = true
  try {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', deleteTicketData.value.id)

    if (error) throw error

    // Remove from local data
    tickets.value = tickets.value.filter(t => t.id !== deleteTicketData.value?.id)

    showDeleteModal.value = false
    deleteTicketData.value = null
  } catch (error) {
    console.error('Error deleting ticket:', error)
    alert('Error deleting ticket. Please try again.')
  } finally {
    loading.value = false
  }
}

// Refresh tickets
const refreshTickets = async () => {
  await getTickets()
}

// Get Tickets
async function getTickets() {
  try {
    loading.value = true
    const { data, error } = await supabase
      .from('tickets')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    tickets.value = data ?? []
  } catch (error) {
    console.error('Error fetching tickets:', error)
    alert('Error fetching tickets. Please try again.')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getTickets()
})
</script>

<style scoped>
/* Custom scrollbar styling */
.custom-scrollbar::-webkit-scrollbar {
  height: 8px;
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 #f1f1f1;
}

/* Custom scrollbar for modal */
.modal-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.modal-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.modal-scrollbar::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 10px;
}

.modal-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth transitions */
.fixed {
  transition: opacity 0.3s ease;
}

/* Ensure sticky columns have proper z-index */
.sticky {
  position: sticky;
}

/* Fix for table header sticky */
thead.sticky {
  top: 0;
  z-index: 30;
}
</style>