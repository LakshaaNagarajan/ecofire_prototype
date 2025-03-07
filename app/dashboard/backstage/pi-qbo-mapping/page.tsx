"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PiJobMappingPage from "@/components/mapping/pi-job-mapping";
import PIQBOMappingsPage from "@/components/mapping/pi-qbo-mapping";

export default function PiQboMappingPage() {
  return (
    <Tabs defaultValue="account" className="w-auto ml-5">
      <TabsList>
        <TabsTrigger value="account">PI to job mapping</TabsTrigger>
        <TabsTrigger value="password">PI to QBO mapping</TabsTrigger>
      </TabsList>
      <TabsContent value="account">
        <PiJobMappingPage/>
      </TabsContent>
      <TabsContent value="password">
        <PIQBOMappingsPage/>
      </TabsContent>
    </Tabs>
  );
}
