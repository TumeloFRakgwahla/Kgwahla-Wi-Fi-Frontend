import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from './ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Shield,
  LogOut,
  Search,
  CheckCircle,
  XCircle,
  Clock,
  Ban,
  Filter,
  Users,
  UserCheck,
  UserX,
  Unlock,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { logoutAdmin, getCurrentAdmin } from '../utils/admin-auth';
import { toast } from 'sonner';
import { API_BASE_URL } from '../constants';

export function AdminDashboard() {
  const navigate = useNavigate();
  const admin = getCurrentAdmin();
  const [tenants, setTenants] = useState([]);
  const [filteredTenants, setFilteredTenants] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [paymentSearchQuery, setPaymentSearchQuery] = useState('');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('tenants');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    loadTenants();
    loadPayments();

    // Set up polling for real-time updates (silent refresh)
    const pollInterval = setInterval(() => {
      loadTenants(false);
      loadPayments(false);
    }, 10000); // Refresh every 10 seconds

    return () => clearInterval(pollInterval);
  }, []);

  useEffect(() => {
    filterTenants();
  }, [searchQuery, statusFilter, tenants]);

  useEffect(() => {
    filterPayments();
  }, [paymentSearchQuery, paymentStatusFilter, payments]);

  const loadTenants = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/tenants`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load tenants');
      }

      const tenantsData = await response.json();
      setTenants(tenantsData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading tenants:', error);
      toast.error('Failed to load tenants');
      setTenants([]);
    } finally {
      if (showRefreshing) setIsRefreshing(false);
    }
  };

  const loadPayments = async (showRefreshing = false) => {
    try {
      if (showRefreshing) setIsRefreshing(true);
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/payments/all`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to load payments');
      }

      const paymentsData = await response.json();
      setPayments(paymentsData);
      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading payments:', error);
      toast.error('Failed to load payments');
      setPayments([]);
    } finally {
      if (showRefreshing) setIsRefreshing(false);
    }
  };

  const filterTenants = () => {
    let filtered = [...tenants];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (tenant) =>
          tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tenant.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tenant.phone.includes(searchQuery) ||
          tenant.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter - map to backend fields
    if (statusFilter !== 'all') {
      if (statusFilter === 'approved') {
        filtered = filtered.filter((tenant) => tenant.wifiAccess === true);
      } else if (statusFilter === 'rejected') {
        filtered = filtered.filter((tenant) => tenant.status === 'blocked');
      } else if (statusFilter === 'pending') {
        filtered = filtered.filter((tenant) => tenant.wifiAccess === false && tenant.status !== 'blocked');
      }
    }

    setFilteredTenants(filtered);
  };

  const filterPayments = () => {
    let filtered = [...payments];

    // Search filter
    if (paymentSearchQuery) {
      filtered = filtered.filter(
        (payment) =>
          payment.tenantId?.name?.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
          payment.tenantId?.roomNumber?.toLowerCase().includes(paymentSearchQuery.toLowerCase()) ||
          payment.type.toLowerCase().includes(paymentSearchQuery.toLowerCase())
      );
    }

    // Status filter
    if (paymentStatusFilter !== 'all') {
      filtered = filtered.filter((payment) => payment.status === paymentStatusFilter);
    }

    setFilteredPayments(filtered);
  };

  const refreshTenants = async () => {
    await loadTenants();
  };

  const handleActivateAccount = async (tenant) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/tenants/activate/${tenant._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to activate account');
      }

      toast.success(`Account activated for ${tenant.name}`);
      await refreshTenants();
    } catch (error) {
      console.error('Error activating account:', error);
      toast.error('Failed to activate account');
    }
  };

  const handleDeactivateAccount = async (tenant) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/tenants/deactivate/${tenant._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to deactivate account');
      }

      toast.success(`Account deactivated for ${tenant.name}`);
      await refreshTenants();
    } catch (error) {
      console.error('Error deactivating account:', error);
      toast.error('Failed to deactivate account');
    }
  };

  const handleBlockTenant = async (tenant) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/tenants/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tenantId: tenant._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to block tenant');
      }

      toast.success(`Tenant ${tenant.name} has been blocked`);
      await refreshTenants();
    } catch (error) {
      console.error('Error blocking tenant:', error);
      toast.error('Failed to block tenant');
    }
  };

  const handleUnblockTenant = async (tenant) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/tenants/unblock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ tenantId: tenant._id }),
      });

      if (!response.ok) {
        throw new Error('Failed to unblock tenant');
      }

      toast.success(`Tenant ${tenant.name} has been unblocked`);
      await refreshTenants();
    } catch (error) {
      console.error('Error unblocking tenant:', error);
      toast.error('Failed to unblock tenant');
    }
  };

  const handleDeleteTenant = async () => {
    if (!tenantToDelete) return;

    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/tenants/${tenantToDelete._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete tenant');
      }

      toast.success(`Tenant ${tenantToDelete.name} and all associated data have been permanently deleted`);
      setShowDeleteDialog(false);
      setTenantToDelete(null);
      await refreshTenants();
      await loadPayments(); // Refresh payments too since tenant payments are deleted
    } catch (error) {
      console.error('Error deleting tenant:', error);
      toast.error('Failed to delete tenant');
    }
  };

  const confirmDeleteTenant = (tenant) => {
    setTenantToDelete(tenant);
    setShowDeleteDialog(true);
  };

  const handleApprovePayment = async (payment) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/payments/approve/${payment._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to approve payment');
      }

      toast.success('Payment approved successfully');
      await loadPayments();
      await loadTenants();
    } catch (error) {
      console.error('Error approving payment:', error);
      toast.error('Failed to approve payment');
    }
  };

  const handleRejectPayment = async (payment) => {
    try {
      const token = localStorage.getItem('admin_token');
      const response = await fetch(`${API_BASE_URL}/payments/reject/${payment._id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to reject payment');
      }

      toast.success('Payment rejected');
      await loadPayments();
    } catch (error) {
      console.error('Error rejecting payment:', error);
      toast.error('Failed to reject payment');
    }
  };

  const handleViewProof = (tenant) => {
    setSelectedTenant(tenant);
    setShowProofDialog(true);
  };

  const handleLogout = () => {
    logoutAdmin();
    toast.info('Admin logged out');
    navigate('/admin/login');
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <Badge className="bg-green-500">
            <CheckCircle className="size-3 mr-1" />
            Approved
          </Badge>
        );
      case 'rejected':
        return (
          <Badge className="bg-red-500">
            <XCircle className="size-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return (
          <Badge className="bg-yellow-500">
            <Clock className="size-3 mr-1" />
            Pending
          </Badge>
        );
    }
  };

  const activeCount = tenants.filter((t) => t.wifiAccess === true).length;
  const blockedCount = tenants.filter((t) => t.status === 'blocked').length;
  const inactiveCount = tenants.filter((t) => t.wifiAccess === false && t.status !== 'blocked').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="max-w-7xl mx-auto pt-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="size-6 text-orange-600" />
              <h1 className="text-slate-900">Admin Dashboard</h1>
            </div>
            <p className="text-slate-600">Welcome back, {admin?.name}</p>
            <p className="text-xs text-slate-500">
              Auto-refresh: every 10s • Last updated: {lastRefresh.toLocaleTimeString()}
              {isRefreshing && <span className="ml-2 text-blue-600">⟳ Refreshing...</span>}
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                loadTenants(true);
                loadPayments(true);
              }}
              disabled={isRefreshing}
            >
              <RefreshCw className={`size-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="size-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Total Tenants</p>
                  <p className="text-slate-900">{tenants.length}</p>
                </div>
                <Users className="size-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Active</p>
                  <p className="text-slate-900">{activeCount}</p>
                </div>
                <CheckCircle className="size-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-yellow-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Inactive</p>
                  <p className="text-slate-900">{inactiveCount}</p>
                </div>
                <Clock className="size-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-300">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Blocked</p>
                  <p className="text-slate-900">{blockedCount}</p>
                </div>
                <XCircle className="size-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Info Alert */}
        <Alert className="mb-6 border-blue-300 bg-blue-50">
          <Shield className="size-4" />
          <AlertDescription>
            Welcome to the admin dashboard. You can view all tenants and manage their WiFi access status.
          </AlertDescription>
        </Alert>

        {/* Management Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tenants">Tenant Management</TabsTrigger>
            <TabsTrigger value="payments">Payment Management</TabsTrigger>
          </TabsList>

          <TabsContent value="tenants">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Tenant Management</CardTitle>
                <CardDescription>
                  View, search, and manage all tenant registrations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      placeholder="Search by name, room, phone, or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <Filter className="size-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="active">Active WiFi</SelectItem>
                        <SelectItem value="inactive">Inactive WiFi</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Tenants Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Room</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>MAC Address</TableHead>
                          <TableHead>WiFi Access</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Expiry</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredTenants.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={8} className="text-center text-slate-500 py-8">
                              No tenants found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredTenants.map((tenant) => (
                            <TableRow key={tenant._id}>
                              <TableCell>
                                <div>
                                  <p>{tenant.name}</p>
                                  {tenant.email && (
                                    <p className="text-xs text-slate-500">{tenant.email}</p>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>{tenant.roomNumber}</TableCell>
                              <TableCell>{tenant.phone}</TableCell>
                              <TableCell>
                                <span className="font-mono text-sm">{tenant.macAddress}</span>
                              </TableCell>
                              <TableCell>
                                <Badge variant={tenant.wifiAccess ? "default" : "secondary"}>
                                  {tenant.wifiAccess ? 'Enabled' : 'Disabled'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge variant={tenant.status === 'blocked' ? "destructive" : "default"}>
                                  {tenant.status === 'blocked' ? 'Blocked' : 'Active'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {tenant.expiryDate
                                  ? new Date(tenant.expiryDate).toLocaleDateString()
                                  : 'N/A'}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {tenant.status === 'blocked' ? (
                                    <Button
                                      size="sm"
                                      className="bg-blue-600 hover:bg-blue-700"
                                      onClick={() => handleUnblockTenant(tenant)}
                                      title="Unblock Account"
                                    >
                                      <Unlock className="size-4" />
                                    </Button>
                                  ) : (
                                    <>
                                      {tenant.status === 'inactive' ? (
                                        <Button
                                          size="sm"
                                          className="bg-green-600 hover:bg-green-700"
                                          onClick={() => handleActivateAccount(tenant)}
                                          title="Activate Account"
                                        >
                                          <UserCheck className="size-4" />
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          className="bg-orange-600 hover:bg-orange-700"
                                          onClick={() => handleDeactivateAccount(tenant)}
                                          title="Deactivate Account"
                                        >
                                          <UserX className="size-4" />
                                        </Button>
                                      )}
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleBlockTenant(tenant)}
                                        title="Block Account"
                                      >
                                        <Ban className="size-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => confirmDeleteTenant(tenant)}
                                        title="Permanently Delete Tenant"
                                        className="bg-red-700 hover:bg-red-800"
                                      >
                                        <Trash2 className="size-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  Showing {filteredTenants.length} of {tenants.length} tenant
                  {tenants.length !== 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>
                  Review and approve/reject payment proofs
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <Input
                      placeholder="Search by tenant name, room, or type..."
                      value={paymentSearchQuery}
                      onChange={(e) => setPaymentSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="w-full sm:w-48">
                    <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                      <SelectTrigger>
                        <Filter className="size-4 mr-2" />
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Payments Table */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tenant</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Uploaded</TableHead>
                          <TableHead>Proof</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPayments.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center text-slate-500 py-8">
                              No payments found
                            </TableCell>
                          </TableRow>
                        ) : (
                          filteredPayments.map((payment) => (
                            <TableRow key={payment._id}>
                              <TableCell>
                                <div>
                                  <p>{payment.tenantId?.name}</p>
                                  <p className="text-xs text-slate-500">Room {payment.tenantId?.roomNumber}</p>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{payment.type}</Badge>
                              </TableCell>
                              <TableCell>
                                {getStatusBadge(payment.status)}
                              </TableCell>
                              <TableCell>
                                {new Date(payment.uploadedAt).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                {(payment.fileData || payment.fileUrl) ? (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      const token = localStorage.getItem('admin_token');
                                      window.open(`${API_BASE_URL}/payments/proof/${payment._id}?token=${token}`, '_blank');
                                    }}
                                  >
                                    View Proof
                                  </Button>
                                ) : (
                                  <span className="text-slate-400">N/A</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                  {payment.status === 'pending' && (
                                    <>
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700"
                                        onClick={() => handleApprovePayment(payment)}
                                      >
                                        <CheckCircle className="size-4" />
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="destructive"
                                        onClick={() => handleRejectPayment(payment)}
                                      >
                                        <XCircle className="size-4" />
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div className="mt-4 text-sm text-slate-600">
                  Showing {filteredPayments.length} of {payments.length} payment
                  {payments.length !== 1 ? 's' : ''}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Tenant</DialogTitle>
              <DialogDescription>
                Are you sure you want to permanently delete <strong>{tenantToDelete?.name}</strong>?
                This action cannot be undone and will also delete all associated payment records.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDeleteTenant}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete Permanently
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

    </div>
  );
}
