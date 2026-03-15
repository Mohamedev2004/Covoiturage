import { FormEvent, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { useDashboardContext } from "@/App";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator } from "@/components/ui/breadcrumb";

export function ProfilePage() {
  const { user, refreshUser, saveProfile } = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [saving, setSaving] = useState(false);
  const { setBreadcrumb } = useDashboardContext();

  useEffect(() => {
    setBreadcrumb(
      <Breadcrumb>
        <BreadcrumbItem>
          <BreadcrumbLink>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink active>Profile</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
    );
  }, [setBreadcrumb]);

  useEffect(() => {
    void refreshUser();
  }, []);

  useEffect(() => {
    if (!user) {
      return;
    }
    setName(user.name);
    setPhone(user.phone_number);
  }, [user]);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await saveProfile({ name, phone_number: phone });
      toast("Profile updated");
    } catch {
      toast("Could not save profile");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col h-full gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground font-medium">Manage your account information and preferences.</p>
      </div>

      <Card className="border-sidebar-border/70 shadow-md overflow-hidden">
        <CardHeader className="bg-sidebar-accent/30 border-b border-sidebar-border/50 pb-8 pt-8">
          <div className="flex flex-col items-center gap-4 text-center">
            <div className="relative group">
              <Avatar className="h-28 w-28 border-4 border-background shadow-xl">
                <AvatarImage src={user.profile_picture ?? undefined} />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground font-bold">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <Button size="icon" variant="secondary" className="absolute bottom-0 right-0 rounded-full shadow-lg border-2 border-background h-10 w-10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
              </Button>
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight">{user.name}</h2>
              <p className="text-muted-foreground font-medium">{user.email}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8">
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                <Input 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  className="h-12 border-sidebar-border/70 font-medium bg-background"
                  required 
                />
              </div>
              <div className="space-y-2.5">
                <label className="text-sm font-bold text-muted-foreground uppercase tracking-widest ml-1">Phone Number</label>
                <Input 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  className="h-12 border-sidebar-border/70 font-medium bg-background"
                  placeholder="+212..."
                  required 
                />
              </div>
            </div>

            <div className="pt-8 border-t border-sidebar-border/50 flex justify-end">
              <Button 
                type="submit" 
                size="lg"
                className="px-10 font-black shadow-xl shadow-primary/20 transition-transform active:scale-[0.98]" 
                disabled={saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving Changes...
                  </span>
                ) : "Save Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-sidebar-border/70 shadow-md border-t-4 border-t-destructive/40">
        <CardHeader>
          <CardTitle className="text-destructive font-black tracking-tight">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-destructive/5 border border-destructive/10">
            <div>
              <p className="font-bold text-destructive">Delete Account</p>
              <p className="text-sm text-muted-foreground font-medium">Once you delete your account, there is no going back. Please be certain.</p>
            </div>
            <Button variant="destructive" className="font-bold px-6 shadow-lg shadow-destructive/20 transition-transform active:scale-[0.98]">Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}