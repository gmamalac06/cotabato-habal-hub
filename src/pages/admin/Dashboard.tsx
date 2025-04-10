import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { dashboardStats, riders, drivers, rides } from "@/lib/mock-data";
import { 
  Users, 
  Bike, 
  Star, 
  Activity, 
  CreditCard, 
  Check, 
  X
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

// Mock data for charts
const rideData = [
  { name: "Mon", rides: 12 },
  { name: "Tue", rides: 18 },
  { name: "Wed", rides: 15 },
  { name: "Thu", rides: 20 },
  { name: "Fri", rides: 25 },
  { name: "Sat", rides: 30 },
  { name: "Sun", rides: 22 },
];

const earningsData = [
  { name: "Mon", earnings: 960 },
  { name: "Tue", earnings: 1440 },
  { name: "Wed", earnings: 1200 },
  { name: "Thu", earnings: 1600 },
  { name: "Fri", earnings: 2000 },
  { name: "Sat", earnings: 2400 },
  { name: "Sun", earnings: 1760 },
];

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">System overview and statistics</p>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{riders.length + drivers.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {riders.length} riders, {drivers.length} drivers
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Rides</CardTitle>
            <Bike className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats.admin.totalRides}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardStats.admin.completedRides} completed, {dashboardStats.admin.cancelledRides} cancelled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">₱{dashboardStats.admin.totalEarnings.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              From all completed rides
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{dashboardStats.admin.averageRating}</div>
            <div className="flex mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < 4 ? 'text-yellow-500 fill-yellow-500' : i < 5 ? 'text-yellow-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Rides Overview</CardTitle>
            <CardDescription>7-day ride history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={rideData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="rides" fill="#0D9488" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>7-day earnings history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={earningsData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [`₱${value}`, 'Earnings']}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke="#F59E0B"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  New user registration
                </p>
                <p className="text-sm text-muted-foreground">
                  Maria Santos registered as a rider
                </p>
                <p className="text-xs text-muted-foreground">
                  4 hours ago
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Bike className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  New driver verification request
                </p>
                <p className="text-sm text-muted-foreground">
                  Jose Rizal submitted documents for verification
                </p>
                <p className="text-xs text-muted-foreground">
                  8 hours ago
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                <Check className="h-5 w-5 text-green-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Payment completed
                </p>
                <p className="text-sm text-muted-foreground">
                  Juan Dela Cruz paid ₱80.00 for a ride
                </p>
                <p className="text-xs text-muted-foreground">
                  12 hours ago
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
                <X className="h-5 w-5 text-red-600" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Ride cancelled
                </p>
                <p className="text-sm text-muted-foreground">
                  A scheduled ride was cancelled by the rider
                </p>
                <p className="text-xs text-muted-foreground">
                  1 day ago
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
