"use client";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Icons } from "../ui/icons";

export const PromptEditor = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Prompt</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input id="title" placeholder="Enter a title for your prompt" />
        </div>
        <div>
          <Label htmlFor="content">Content</Label>
          <Textarea
            id="content"
            placeholder="Enter your prompt content here"
            className="min-h-[200px]"
          />
        </div>
        <div>
          <Label htmlFor="tags">Tags</Label>
          <Input id="tags" placeholder="Add tags (comma-separated)" />
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline">Cancel</Button>
          <Button>
            <Icons.Save className="mr-2 h-4 w-4" />
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};