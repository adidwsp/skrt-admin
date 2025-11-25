<template>
  <div class="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800">
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
        <div class="mt-4 sm:mt-0 flex flex-col sm:flex-row sm:items-center gap-3">
          <!-- Filter Button & Dropdown -->
          <div class="relative flex flex-col sm:flex-row">
            <button
              @click="showFilterDropdown = !showFilterDropdown"
              class="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors duration-200 w-full sm:w-auto"
            >
              <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"/>
              </svg>
              <span class="text-sm text-gray-700 dark:text-gray-300">Filter</span>
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Filter Dropdown -->
            <div v-if="showFilterDropdown" class="absolute right-0 mt-10 sm:mt-2 w-full sm:w-64 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
              <div class="p-4 space-y-4">
                <!-- Status Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                  <select v-model="filters.status" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="all">All Status</option>
                    <option value="scanned">Scanned</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>

                <!-- Gender Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Gender</label>
                  <select v-model="filters.gender" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="all">All Gender</option>
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <!-- Student Filter -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Student Status</label>
                  <select v-model="filters.is_student" class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                    <option value="all">All</option>
                    <option value="true">Student</option>
                    <option value="false">Non-Student</option>
                  </select>
                </div>

                <!-- Action Buttons -->
                <div class="flex space-x-2 pt-2">
                  <button
                    @click="applyFilters"
                    class="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition-colors duration-200"
                  >
                    Apply
                  </button>
                  <button
                    @click="resetFilters"
                    class="flex-1 px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Export Button -->
          <button
            @click="exportToExcel"
            :disabled="loading || filteredTickets.length === 0"
            class="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto"
            title="Export to Excel"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            <span class="text-sm">Export Excel</span>
          </button>

          <!-- Search Input -->
          <div class="relative w-full sm:w-64">
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search tickets..."
              class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400 w-full"
              @input="resetPagination"
            >
            <div class="absolute left-3 top-2.5">
              <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Refresh Button -->
          <button
            @click="refreshTickets"
            class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors duration-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 w-full sm:w-auto flex items-center justify-center"
            :disabled="loading"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Table Container -->
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
            v-for="(ticket, index) in paginatedTickets" 
            :key="ticket.id"
            class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150 cursor-pointer group"
            @click="viewTicketDetail(ticket)"
          >
            <!-- No. Column - Sticky -->
            <td class="left-0 z-30 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/50 px-4 py-3 text-theme-sm font-medium text-gray-900 dark:text-white border-r border-gray-200 dark:border-gray-600">
              {{ (currentPage - 1) * itemsPerPage + index + 1 }}
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
            {{ searchQuery || hasActiveFilters ? 'No tickets match your search or filters.' : 'There are no tickets in the database yet.' }}
          </p>
          <button
            v-if="searchQuery || hasActiveFilters"
            @click="clearAllFilters"
            class="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Clear all filters
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="filteredTickets.length > 0" class="flex flex-col sm:flex-row items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div class="flex items-center space-x-4 mb-4 sm:mb-0">
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-700 dark:text-gray-300">Show</span>
          <select
            v-model="itemsPerPage"
            @change="resetPagination"
            class="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
          <span class="text-sm text-gray-700 dark:text-gray-300">entries</span>
        </div>
        <div class="text-sm text-gray-700 dark:text-gray-300">
          Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredTickets.length }} entries
        </div>
      </div>
      
      <div class="flex items-center space-x-1">
        <!-- Pagination buttons (same as before) -->
        <!-- ... (pagination code remains the same) ... -->
      </div>
    </div>
  </div>

  <!-- Enhanced Detail Modal -->
  <div
    v-if="showDetailModal"
    class="fixed inset-0 z-[100] overflow-y-auto mt-16"
    @click="showDetailModal = false"
  >
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
      
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div
        class="relative inline-block w-full max-w-4xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl dark:bg-gray-800 sm:my-8 sm:align-middle sm:p-6"
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
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Ticket Details
              </h3>
              <div class="flex items-center space-x-2">
                <span 
                  class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium capitalize"
                  :class="statusClasses(selectedTicket?.is_scanned ?? false)"
                >
                  <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path v-if="selectedTicket?.is_scanned" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  {{ selectedTicket?.is_scanned ? 'Scanned' : 'Pending Scan' }}
                </span>
              </div>
            </div>
            
            <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Personal Information -->
              <div class="space-y-4">
                <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    Personal Information
                  </h4>
                  <dl class="space-y-3">
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Full Name</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">{{ selectedTicket?.name || '-' }}</dd>
                    </div>
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Gender</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">
                        <span class="inline-flex px-2 py-1 text-xs rounded-md capitalize" :class="genderClasses(selectedTicket?.gender ?? '')">
                          {{ selectedTicket?.gender || '-' }}
                        </span>
                      </dd>
                    </div>
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Email</dt>
                      <dd class="text-sm font-medium text-blue-600 dark:text-blue-400 text-right">{{ selectedTicket?.email || '-' }}</dd>
                    </div>
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Phone</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">{{ selectedTicket?.phone || '-' }}</dd>
                    </div>
                  </dl>
                </div>

                <!-- University Information -->
                <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                    </svg>
                    Education Information
                  </h4>
                  <dl class="space-y-3">
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">University</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">{{ selectedTicket?.university || '-' }}</dd>
                    </div>
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Student Status</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">
                        <span class="inline-flex items-center px-2 py-1 text-xs rounded-md" :class="selectedTicket?.is_student ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'">
                          {{ selectedTicket?.is_student ? 'Student' : 'Non-Student' }}
                        </span>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <!-- Ticket & Donation Information -->
              <div class="space-y-4">
                <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"/>
                    </svg>
                    Ticket Information
                  </h4>
                  <dl class="space-y-3">
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Ticket Number</dt>
                      <dd class="text-sm font-mono font-medium text-blue-600 dark:text-blue-400 text-right">{{ selectedTicket?.ticket_number || '-' }}</dd>
                    </div>
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Scan Status</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">
                        <span class="inline-flex items-center px-2 py-1 text-xs rounded-md capitalize" :class="statusClasses(selectedTicket?.is_scanned ?? false)">
                          {{ selectedTicket?.is_scanned ? 'Scanned' : 'Pending' }}
                        </span>
                      </dd>
                    </div>
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Created At</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">{{ formatDateTime(selectedTicket?.created_at ?? '') }}</dd>
                    </div>
                  </dl>
                </div>

                <!-- Donation Information -->
                <div class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
                    </svg>
                    Donation Information
                  </h4>
                  <dl class="space-y-3">
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Amount</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">Rp {{ formatCurrency(selectedTicket?.donation_amount || 0) }}</dd>
                    </div>
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Bank</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">{{ selectedTicket?.donation_bank || '-' }}</dd>
                    </div>
                  </dl>
                </div>

                <!-- Family Information -->
                <div v-if="selectedTicket?.with_child" class="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                  <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
                    </svg>
                    Family Information
                  </h4>
                  <dl class="space-y-3">
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">With Children</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">Yes</dd>
                    </div>
                    <div class="flex justify-between items-start">
                      <dt class="text-xs text-gray-500 dark:text-gray-400">Number of Children</dt>
                      <dd class="text-sm font-medium text-gray-900 dark:text-white text-right">{{ selectedTicket?.num_of_children || 0 }}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <!-- Address Section -->
            <div v-if="selectedTicket?.address" class="mt-6 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <h4 class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <svg class="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Address
              </h4>
              <p class="text-sm text-gray-900 dark:text-white">{{ selectedTicket.address }}</p>
            </div>
          </div>
        </div>
        
        <div class="mt-6 sm:mt-5 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="showDetailModal = false"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- Edit and Delete Modals (remain the same) -->
  <!-- ... (edit and delete modal code remains the same) ... -->
</template>

<script setup lang="ts">
import { onMounted, ref, reactive, computed, watch } from 'vue'
import { supabase } from '../../../utils/supabase'
import * as XLSX from 'xlsx'

interface Tickets {
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

const tickets = ref<Tickets[]>([])
const loading = ref(false)
const showEditModal = ref(false)
const showDetailModal = ref(false)
const showDeleteModal = ref(false)
const showFilterDropdown = ref(false)
const searchQuery = ref('')

// Filter variables
const filters = reactive({
  status: 'all',
  gender: 'all',
  is_student: 'all'
})

// Pagination variables
const currentPage = ref(1)
const itemsPerPage = ref(10)

const selectedTicket = ref<Tickets | null>(null)
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

const deleteTicketData = ref<Tickets | null>(null)

// Computed properties
const hasActiveFilters = computed(() => {
  return filters.status !== 'all' || filters.gender !== 'all' || filters.is_student !== 'all'
})

const filteredTickets = computed(() => {
  let filtered = tickets.value
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(ticket => 
      ticket.name?.toLowerCase().includes(query) ||
      ticket.email?.toLowerCase().includes(query) ||
      ticket.ticket_number?.toLowerCase().includes(query) ||
      ticket.university?.toLowerCase().includes(query) ||
      ticket.phone?.toLowerCase().includes(query)
    )
  }
  
  // Apply status filter
  if (filters.status !== 'all') {
    filtered = filtered.filter(ticket => {
      if (filters.status === 'scanned') return ticket.is_scanned
      if (filters.status === 'pending') return !ticket.is_scanned
      return true
    })
  }
  
  // Apply gender filter
  if (filters.gender !== 'all') {
    filtered = filtered.filter(ticket => ticket.gender === filters.gender)
  }
  
  // Apply student filter
  if (filters.is_student !== 'all') {
    const isStudent = filters.is_student === 'true'
    filtered = filtered.filter(ticket => ticket.is_student === isStudent)
  }
  
  return filtered
})

const scannedTickets = computed(() => {
  return filteredTickets.value.filter(ticket => ticket.is_scanned).length
})

const pendingTickets = computed(() => {
  return filteredTickets.value.filter(ticket => !ticket.is_scanned).length
})

const totalDonation = computed(() => {
  return filteredTickets.value.reduce((sum, ticket) => sum + (ticket.donation_amount || 0), 0)
})

// Pagination computed properties (remain the same)
const totalPages = computed(() => {
  return Math.ceil(filteredTickets.value.length / itemsPerPage.value)
})

const paginatedTickets = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredTickets.value.slice(start, end)
})

const startIndex = computed(() => {
  return (currentPage.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
  const end = startIndex.value + itemsPerPage.value
  return end > filteredTickets.value.length ? filteredTickets.value.length : end
})

const visiblePages = computed(() => {
  const pages = []
  const maxVisiblePages = 5
  let startPage = Math.max(1, currentPage.value - Math.floor(maxVisiblePages / 2))
  let endPage = Math.min(totalPages.value, startPage + maxVisiblePages - 1)
  
  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1)
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }
  
  return pages
})

const showStartEllipsis = computed(() => {
  return visiblePages.value[0] > 1
})

const showEndEllipsis = computed(() => {
  return visiblePages.value[visiblePages.value.length - 1] < totalPages.value
})

// Methods
const applyFilters = () => {
  showFilterDropdown.value = false
  resetPagination()
}

const resetFilters = () => {
  filters.status = 'all'
  filters.gender = 'all'
  filters.is_student = 'all'
  resetPagination()
}

const clearAllFilters = () => {
  searchQuery.value = ''
  resetFilters()
}

const exportToExcel = () => {
  // Prepare data for Excel
  const excelData = filteredTickets.value.map((ticket, index) => ({
    'No': index + 1,
    'Name': ticket.name || '',
    'Gender': ticket.gender || '',
    'Email': ticket.email || '',
    'Phone': ticket.phone || '',
    'Ticket Number': ticket.ticket_number || '',
    'Status': ticket.is_scanned ? 'Scanned' : 'Pending',
    'University': ticket.university || '',
    'Student': ticket.is_student ? 'Yes' : 'No',
    'Donation Amount': ticket.donation_amount || 0,
    'Donation Bank': ticket.donation_bank || '',
    'With Child': ticket.with_child ? 'Yes' : 'No',
    'Children Count': ticket.num_of_children || 0,
    'Created At': formatDateTime(ticket.created_at)
  }))

  // Create workbook and worksheet
  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.json_to_sheet(excelData)

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Tickets')

  // Generate Excel file and download
  const fileName = `tickets_export_${new Date().toISOString().split('T')[0]}.xlsx`
  XLSX.writeFile(wb, fileName)
}

// Existing methods (remain the same)
const statusClasses = (isScanned: boolean) => {
  return isScanned 
    ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
}

const genderClasses = (gender: string) => {
  switch (gender?.toLowerCase()) {
    case 'laki-laki':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
    case 'perempuan':
      return 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
  }
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID').format(amount)
}

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

const viewTicketDetail = (ticket: Tickets) => {
  selectedTicket.value = ticket
  showDetailModal.value = true
}

const editTicket = (ticket: Tickets) => {
  editForm.id = ticket.id || ''
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

const updateTicket = async () => {
  if (!editForm.id) return

  loading.value = true
  try {
    const payload: any = {
        name: editForm.name,
        gender: editForm.gender,
        university: editForm.university,
        phone: editForm.phone,
        email: editForm.email,
        ticket_number: editForm.ticket_number,
        donation_amount: editForm.donation_amount,
        is_scanned: editForm.is_scanned,
        updated_at: new Date().toISOString()
    }

    const { error } = await supabase
      .from('tickets')
      .update(payload)
      .eq('id', editForm.id)

    if (error) throw error

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

const confirmDelete = (ticket: Tickets) => {
  deleteTicketData.value = ticket
  showDeleteModal.value = true
}

const deleteTicket = async () => {
  if (!deleteTicketData.value) return

  loading.value = true
  try {
    const { error } = await supabase
      .from('tickets')
      .delete()
      .eq('id', deleteTicketData.value.id)

    if (error) throw error

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

const refreshTickets = async () => {
  await getTickets()
  resetPagination()
}

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const resetPagination = () => {
  currentPage.value = 1
}

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

// Close filter dropdown when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showFilterDropdown.value = false
  }
}

onMounted(() => {
  getTickets()
  document.addEventListener('click', handleClickOutside)
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