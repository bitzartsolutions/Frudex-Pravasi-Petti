import { AdminHeader } from "@/components/admin/AdminHeader";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getAdminUser } from "@/lib/supabase/requireAdmin";
import { getSettings } from "@/lib/data/adminCatalog";

export default async function AdminSettingsPage() {
  const [user, settings] = await Promise.all([getAdminUser(), getSettings()]);

  return (
    <>
      <AdminHeader title="Settings" />
      <div className="p-space-lg max-w-xl space-y-space-lg">
        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-variant/40 space-y-space-sm">
          <h2 className="font-headline-sm text-headline-sm text-primary">Account</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Signed in as <span className="font-semibold text-primary">{user?.email}</span>
          </p>
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-variant/40 space-y-space-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-primary">WhatsApp Ordering</h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              The number every customer order is sent to. Changes take effect immediately —
              no developer or redeploy needed.
            </p>
          </div>
          <SettingsForm whatsappNumber={settings.whatsapp_number} />
        </div>

        <div className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm border border-surface-variant/40 space-y-space-sm">
          <h2 className="font-headline-sm text-headline-sm text-primary">Environment</h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Supabase, Cloudinary and other integration credentials are set up once by whoever
            manages the deployment and don&rsquo;t need to be touched day-to-day.
          </p>
        </div>
      </div>
    </>
  );
}
