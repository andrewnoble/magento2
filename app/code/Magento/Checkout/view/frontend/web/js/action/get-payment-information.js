/**
 * Copyright © 2015 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
define(
    [
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/model/url-builder',
        'mage/storage',
        'Magento_Checkout/js/model/error-processor',
        'Magento_Customer/js/model/customer',
        'Magento_Checkout/js/model/payment/method-converter',
        'Magento_Checkout/js/model/payment-service'
    ],
    function (quote, urlBuilder, storage, errorProcessor, customer, methodConverter, paymentService) {
        'use strict';

        return function () {
            var serviceUrl,
                payload;

            /**
             * Checkout for guest and registered customer.
             */
            if (!customer.isLoggedIn()) {
                serviceUrl = urlBuilder.createUrl('/guest-carts/:cartId/payment-information', {
                    cartId: quote.getQuoteId()
                });
            } else {
                serviceUrl = urlBuilder.createUrl('/carts/mine/payment-information', {});
            }
            payload = {
                cartId: quote.getQuoteId()
            };
            return storage.get(
                serviceUrl, JSON.stringify(payload)
            ).done(
                function (response) {
                    quote.setTotals(response.totals);
                    paymentService.setPaymentMethods(methodConverter(response.payment_methods));
                }
            ).fail(
                function (response) {
                    errorProcessor.process(response);
                }
            );
        };
    }
);