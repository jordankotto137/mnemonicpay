import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { MnemonicDisplay } from '@/components/ui/mnemonic-display';
import { AmountInput } from '@/components/ui/amount-input';
import { formatCurrency } from '@/lib/utils';
import React from 'react';

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Send Money with <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-600">Simple Words</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              MnemonicPay lets you send money using easy-to-remember 3-word phrases. 
              Recipients can instantly cash out to their debit card without creating an account.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="bitcoin" size="lg" className="w-full sm:w-auto">
                Create a Phrase
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Redeem a Phrase
              </Button>
            </div>
          </div>
          <div className="flex justify-center">
            <Card variant="bitcoin" className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Example Phrase</CardTitle>
                <CardDescription>
                  This is how your mnemonic phrase will look
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MnemonicDisplay phrase="quantum doctor unknown" size="lg" animated={true} />
                <div className="mt-6 text-center">
                  <span className="text-2xl font-bold text-amber-600">
                    {formatCurrency(50)}
                  </span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <p className="text-sm text-gray-500">
                  Secure, instant, and easy to share
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 bg-amber-50 rounded-xl my-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  1
                </div>
                <CardTitle>Create a Phrase</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Generate a unique 3-word phrase and assign any dollar amount to it from your account.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  2
                </div>
                <CardTitle>Share the Phrase</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Share the phrase with anyone - write it down, text it, or send a secure link.
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-4">
                  3
                </div>
                <CardTitle>Instant Redemption</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Recipients enter the phrase and their debit card details to instantly receive the funds.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 my-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose MnemonicPay</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Secure</h3>
                <p className="mt-1 text-gray-600">
                  Built with Bitcoin-level cryptography and two-phase security. Each phrase can only be used once.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Instant</h3>
                <p className="mt-1 text-gray-600">
                  Recipients get their money instantly on their debit card, just like Cash App.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Private</h3>
                <p className="mt-1 text-gray-600">
                  No account required for recipients. Minimal information collected.
                </p>
              </div>
            </div>
            
            <div className="flex">
              <div className="mr-4 flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Flexible</h3>
                <p className="mt-1 text-gray-600">
                  Create an account to track your activity or use without an account. Your choice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl my-12 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of users who are already sending money with MnemonicPay.
            No complicated apps or long account setup required.
          </p>
          <Button size="lg" className="bg-white text-amber-600 hover:bg-gray-100">
            Create Your First Phrase
          </Button>
        </div>
      </section>
    </div>
  );
}
