
'use client'

import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

type JobPostProps = {
  title: string;
  postedDate: string;
  applications: number;
  status: "open" | "closed";
  onEdit: () => void;
  onDelete: () => void;
};

export const JobPostCard = ({
  title,
  postedDate,
  applications,
  status,
  onEdit,
  onDelete,
}: JobPostProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <Badge variant={status === "open" ? "default" : "destructive"}>
          {status.toUpperCase()}
        </Badge>
      </CardHeader>

      <CardContent className="text-sm text-muted-foreground">
        <p>📅 Posted: {postedDate}</p>
        <p>👥 Applicants: {applications}</p>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onEdit}>
          <Pencil className="w-4 h-4 mr-1" /> Edit
        </Button>
        <Button variant="destructive" size="sm" onClick={onDelete}>
          <Trash2 className="w-4 h-4 mr-1" /> Delete
        </Button>
      </CardFooter>
    </Card>
  );
};
