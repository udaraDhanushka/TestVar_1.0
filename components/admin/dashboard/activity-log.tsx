'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export function ActivityLog() {
  const activities = [
    {
      user: "John Doe",
      action: "Created new flashcard set",
      details: "Advanced Mathematics - Calculus",
      timestamp: "2024-03-26 14:30",
    },
    {
      user: "Jane Smith",
      action: "Updated flashcard set",
      details: "Spanish Vocabulary - Basics",
      timestamp: "2024-03-26 14:25",
    },
  ];

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
              <TableHead>Details</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activities.map((activity, index) => (
              <TableRow key={index}>
                <TableCell>{activity.user}</TableCell>
                <TableCell>{activity.action}</TableCell>
                <TableCell>{activity.details}</TableCell>
                <TableCell>{activity.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}