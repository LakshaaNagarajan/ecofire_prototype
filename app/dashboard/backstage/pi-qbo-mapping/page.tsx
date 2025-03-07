"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PiJobMappingPage from "@/components/mapping/pi-job-mapping";

export default function PiQboMappingPage() {
  return (
    <Tabs defaultValue="account" className="w-auto">
      <TabsList>
        <TabsTrigger value="account">PI to job mapping</TabsTrigger>
        <TabsTrigger value="password">PI to QBO mapping</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <PiJobMappingPage/>
      </TabsContent>
      <TabsContent value="password">Add qbo mapping page here</TabsContent>
    </Tabs>
  );
}
