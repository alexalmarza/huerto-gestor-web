
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, MapPin, CreditCard, FileText, UserX } from "lucide-react";
import { PlotsManagement } from "@/components/PlotsManagement";
import { MembersManagement } from "@/components/MembersManagement";
import { InactiveMembersManagement } from "@/components/InactiveMembersManagement";
import { PaymentsManagement } from "@/components/PaymentsManagement";
import { ReportsManagement } from "@/components/ReportsManagement";
import Header from "@/components/Header";
import { usePlots } from "@/hooks/usePlots";
import { useMembers } from "@/hooks/useMembers";
import { useTranslation } from "@/hooks/useTranslation";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { plots } = usePlots();
  const { members } = useMembers();
  const { t } = useTranslation();

  // Calculate statistics from real data
  const totalPlots = plots.length;
  const occupiedPlots = plots.filter(plot => plot.status === 'ocupada').length;
  const availablePlots = plots.filter(plot => plot.status === 'disponible').length;
  const activeMembers = members.filter(member => member.is_active).length;
  const inactiveMembers = members.filter(member => !member.is_active).length;
  const pendingPayments = members.filter(member => member.payment_status === 'pendiente').length;

  const stats = [
    { title: t('totalPlots'), value: totalPlots.toString(), icon: MapPin, color: "text-green-600" },
    { title: t('activeMembers'), value: activeMembers.toString(), icon: Users, color: "text-blue-600" },
    { title: t('pendingPayments'), value: pendingPayments.toString(), icon: CreditCard, color: "text-orange-600" },
    { title: t('generatedReports'), value: "0", icon: FileText, color: "text-purple-600" },
  ];

  const occupancyPercentage = totalPlots > 0 ? Math.round((occupiedPlots / totalPlots) * 100) : 0;
  const totalMembers = activeMembers + inactiveMembers;
  const paymentPercentage = totalMembers > 0 ? Math.round(((totalMembers - pendingPayments) / totalMembers) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-white shadow-sm">
            <TabsTrigger value="overview" className="flex items-center space-x-2">
              <span>{t('overview')}</span>
            </TabsTrigger>
            <TabsTrigger value="plots" className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>{t('plots')}</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span>{t('members')}</span>
            </TabsTrigger>
            <TabsTrigger value="inactive-members" className="flex items-center space-x-2">
              <UserX className="h-4 w-4" />
              <span>{t('inactiveMembers')}</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>{t('payments')}</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>{t('reports')}</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {stats.map((stat, index) => (
                <Card key={index} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-600">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    <span>{t('plotStatus')}</span>
                  </CardTitle>
                  <CardDescription>
                    {t('plotsDistribution', { total: totalPlots.toString() })}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('occupied')}</span>
                      <span className="font-semibold text-green-600">{occupiedPlots} ({occupancyPercentage}%)</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('available')}</span>
                      <span className="font-semibold text-blue-600">{availablePlots} ({100 - occupancyPercentage}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: `${occupancyPercentage}%` }}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>{t('memberStatus')}</span>
                  </CardTitle>
                  <CardDescription>
                    {t('membersDistribution')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('active')}</span>
                      <span className="font-semibold text-green-600">{activeMembers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('inactive')}</span>
                      <span className="font-semibold text-red-600">{inactiveMembers}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">{t('pendingPayments')}</span>
                      <span className="font-semibold text-orange-600">{pendingPayments}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="plots">
            <PlotsManagement />
          </TabsContent>

          <TabsContent value="members">
            <MembersManagement />
          </TabsContent>

          <TabsContent value="inactive-members">
            <InactiveMembersManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentsManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
