import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function FeedbackPage() {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus('submitting');
    
    const form = e.currentTarget;
    const formData = new FormData(form);
    
    try {
      const response = await fetch('https://formsubmit.co/rehansaqib.getz@gmail.com', {
        method: 'POST',
        body: formData,
      });
      
      if (response.ok) {
        setFormStatus('success');
        form.reset();
      } else {
        setFormStatus('error');
      }
    } catch (error) {
      setFormStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="w-full h-[300px] relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-600 opacity-90"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center text-white">
            Get in Touch
          </h1>
          <p className="text-lg md:text-xl text-center text-white/90">
            We'd love to hear your feedback or answer any questions
          </p>
        </div>
      </div>
      
      <div className="max-w-2xl mx-auto px-4 py-12">
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="_captcha" value="false" />
          
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <Input
              id="name"
              name="name"
              required
              className="w-full"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              className="w-full"
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={6}
              className="w-full min-h-[150px] px-3 py-2 resize-y border rounded-md border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              placeholder="Your message..."
            />
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white"
              disabled={formStatus === 'submitting'}
            >
              {formStatus === 'submitting' ? 'Sending...' : 'Send Message'}
            </Button>
          </div>

          {formStatus === 'success' && (
            <div className="p-4 bg-green-50 text-green-700 rounded-md">
              Thank you for your message! We'll get back to you soon.
            </div>
          )}

          {formStatus === 'error' && (
            <div className="p-4 bg-red-50 text-red-700 rounded-md">
              Something went wrong. Please try again later.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
