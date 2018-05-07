const invoiceTemplate = "<!doctype html>\n" +
    "<html>\n" +
    "<head>\n" +
    "    <meta charset=\"utf-8\">\n" +
    "    <title>Hóa đơn</title>\n" +
    "\n" +
    "    <style>\n" +
    "        .invoice-box {\n" +
    "            max-width: 800px;\n" +
    "            margin: auto;\n" +
    "            padding: 30px;\n" +
    "            border: 1px solid #eee;\n" +
    "            box-shadow: 0 0 10px rgba(0, 0, 0, .15);\n" +
    "            font-size: 16px;\n" +
    "            line-height: 24px;\n" +
    "            font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;\n" +
    "            color: #555;\n" +
    "        }\n" +
    "        .invoice-box table {\n" +
    "            width: 100%;\n" +
    "            line-height: inherit;\n" +
    "            text-align: left;\n" +
    "        }\n" +
    "        .invoice-box table td {\n" +
    "            padding: 5px;\n" +
    "            vertical-align: top;\n" +
    "        }\n" +
    "        .invoice-box table tr td:nth-child(2) {\n" +
    "            text-align: right;\n" +
    "        }\n" +
    "        .invoice-box table tr td:nth-child(3) {\n" +
    "            text-align: right;\n" +
    "        }\n" +
    "        .invoice-box table tr td:nth-child(4) {\n" +
    "            text-align: right;\n" +
    "        }\n" +
    "        .invoice-box table tr.top table td {\n" +
    "            padding-bottom: 20px;\n" +
    "        }\n" +
    "        .invoice-box table tr.top table td.title {\n" +
    "            font-size: 45px;\n" +
    "            line-height: 45px;\n" +
    "            color: #333;\n" +
    "        }\n" +
    "        .invoice-box table tr.information table td {\n" +
    "            padding-bottom: 40px;\n" +
    "        }\n" +
    "        .invoice-box table tr.heading td {\n" +
    "            background: #eee;\n" +
    "            border-bottom: 1px solid #ddd;\n" +
    "            font-weight: bold;\n" +
    "        }\n" +
    "        .invoice-box table tr.details td {\n" +
    "            padding-bottom: 20px;\n" +
    "        }\n" +
    "        .invoice-box table tr.item td {\n" +
    "            border-bottom: 1px solid #eee;\n" +
    "        }\n" +
    "        .invoice-box table tr.item.last td {\n" +
    "            border-bottom: none;\n" +
    "        }\n" +
    "        .invoice-box table tr.total td:nth-child(2) {\n" +
    "            border-top: 2px solid #eee;\n" +
    "            font-weight: bold;\n" +
    "        }\n" +
    "        @media only screen and (max-width: 600px) {\n" +
    "            .invoice-box table tr.top table td {\n" +
    "                width: 100%;\n" +
    "                display: block;\n" +
    "                text-align: center;\n" +
    "            }\n" +
    "            .invoice-box table tr.information table td {\n" +
    "                width: 100%;\n" +
    "                display: block;\n" +
    "                text-align: center;\n" +
    "            }\n" +
    "        }\n" +
    "        /** RTL **/\n" +
    "        .rtl {\n" +
    "            direction: rtl;\n" +
    "            font-family: Tahoma, 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;\n" +
    "        }\n" +
    "        .rtl table {\n" +
    "            text-align: right;\n" +
    "        }\n" +
    "        .rtl table tr td:nth-child(2) {\n" +
    "            text-align: left;\n" +
    "        }\n" +
    "    </style>\n" +
    "</head>\n" +
    "\n" +
    "<body>\n" +
    "<div class=\"invoice-box\">\n" +
    "    <table cellpadding=\"0\" cellspacing=\"0\">\n" +
    "        <tr class=\"top\">\n" +
    "            <td colspan=\"2\">\n" +
    "                <table>\n" +
    "                    <tr>\n" +
    "                        <td style=\"width: 30%;\">\n" +
    "                            <img src=\"https://image.freepik.com/free-icon/invoice_318-1478.jpg\"\n" +
    "                                 style=\"width:50%; max-width:300px;\">\n" +
    "\n" +
    "\n" +
    "                        </td>\n" +
    "                        <td style=\"text-align: center\">\n" +
    "                            <p style=\"font-size: 45px\">HÓA ĐƠN</p>\n" +
    "                        </td>\n" +
    "                        <td style=\"width: 30%;text-align: right;\">\n" +
    "                            {{company.companyName}}<br>\n" +
    "                            {{company.address}}<br>\n" +
    "                            {{company.phoneNumber}}<br>\n" +
    "                            {{company.email}}\n" +
    "                        </td>\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "\n" +
    "        <tr class=\"information\">\n" +
    "            <td colspan=\"2\">\n" +
    "                <table>\n" +
    "                    <tr>\n" +
    "                        <td>\n" +
    "                            <strong>Mã hoá đơn:</strong> {{invoice.invoiceId}}<br>\n" +
    "                            <strong>Ngày tạo:</strong> {{invoice.createdAt}}<br>\n" +
    "                            <strong>Hình thức thanh toán:</strong> {{trans.paymentMethod}}\n" +
    "                        </td>\n" +
    "\n" +
    "                        <!--<td>\n" +
    "                            {Tên Khách hàng}<br>\n" +
    "                            {Địa chỉ}<br>\n" +
    "                            {Số điện thoại}<br>\n" +
    "                            {Email}\n" +
    "                        </td>-->\n" +
    "                    </tr>\n" +
    "                </table>\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "    <table cellpadding=\"0\" cellspacing=\"0\" id=\"pruductSale\">\n" +
    "\n" +
    "        <tr class=\"heading\">\n" +
    "            <td>\n" +
    "                Sản phầm\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                Số lượng\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                Đơn vị\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                Giá\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        {{#productItems}}\n" +
    "        <tr class=\"item\">\n" +
    "            <td>\n" +
    "                {{productName}}\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                {{quantity}}\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                {{unit}}\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                {{price.price}} đ\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "        {{#discount}}\n" +
    "        <tr class=\"item\">\n" +
    "\n" +
    "            <td style=\"font-weight: 500;text-align: right\">\n" +
    "                Khuyến mãi:\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                {{name}}\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                {{discountValue}}\n" +
    "            </td>\n" +
    "            <td>\n" +
    "                {{discount}}\n" +
    "            </td>\n" +
    "\n" +
    "        </tr>\n" +
    "        {{/discount}}\n" +
    "        {{/productItems}}\n" +
    "        <tr class=\"total\">\n" +
    "            <td></td>\n" +
    "            <td></td>\n" +
    "            <td></td>\n" +
    "            <td>\n" +
    "                <strong>Tổng:</strong> {{total}} đ\n" +
    "            </td>\n" +
    "        </tr>\n" +
    "    </table>\n" +
    "</div>\n" +
    "</body>\n" +
    "</html>";

export default invoiceTemplate
