import { useNavigate } from 'react-router';
import { Separator } from './ui/separator';

export function Footer() {
  const navigate = useNavigate();

  return (
    <footer className="mt-12 pb-8">
      <Separator className="mb-6" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-center gap-12 mb-6">
      
          <div>
            <h4 className="mb-3">Support</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button
                  onClick={() => navigate('/faq')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  FAQs
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/contact')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Contact Us
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3">Legal</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button
                  onClick={() => navigate('/terms')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('/privacy')}
                  className="hover:text-indigo-600 transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>

        </div>

        <Separator className="mb-4" />

        <div className="text-center text-sm text-slate-600">
          <p>© 2025 Kgwahla Residences. All rights reserved.</p>
          <p className="mt-1">High-Speed WiFi Management System</p>
        </div>
      </div>
    </footer>
  );
}
