'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useCallback, useEffect, useState } from "react";

export function ActivityLog() {
  const [activityLog, setActivityLog] = useState([])
  const [loading, setLoading] = useState(false)
  const fetchActivityLog = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/activity-log`);
      if (response.ok) {
        const data = await response.json();
        setActivityLog(data);
      }
    } catch (error) {
      console.error('Failed to fetch flashcard set:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActivityLog();
  }, [fetchActivityLog]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Action Type</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activityLog.map((activity, index) => (
              <TableRow key={index}>
                <TableCell>{`${activity.actor.first_name} ${activity.actor.last_name}`}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.actionType}</TableCell>
                <TableCell>{(new Date(activity.timestamp)).toDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
