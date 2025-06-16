// This page has been moved to /admin/forms
// It now redirects to the new location.
import { redirect } from 'next/navigation';

export default function ReportsPageRedirect() {
  redirect('/admin/forms');
  // The redirect function throws an error to stop rendering, 
  // so technically nothing needs to be returned here.
  // However, to satisfy linters or type checkers, you might return null or a minimal component.
  return null;
}
