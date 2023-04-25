
    function coupenValidateForm() {
        let coupencode = document.forms["Submission"]["coupencode"].value;
        let discounttype = document.forms["Submission"]["discounttype"].value;
        let discountvalue = document.forms["Submission"]["discountvalue"].value;
        let maxdiscountamount = document.forms["Submission"]["maxdiscountamount"].value;
        let minpurchase = document.forms["Submission"]["minpurchase"].value;
        let startingdate = document.forms["Submission"]["startingdate"].value;
        let expiredate = document.forms["Submission"]["expiredate"].value;
        let status = document.forms["Submission"]["status"].value;

        if (coupencode === "") {
            document.getElementById("coupenErorr").innerHTML = "Please enter a coupen code";
            return false;
        }

        if (discounttype === "") {
            document.getElementById("coupenErorr").innerHTML = "Please select a discount type";
            return false;
        }

        if (discountvalue === "") {
            document.getElementById("coupenErorr").innerHTML = "Please enter a discount value";
            return false;
        }

        if (maxdiscountamount === "") {
            document.getElementById("coupenErorr").innerHTML = "Please enter a maximum discount amount";
            return false;
        }

        if (minpurchase === "") {
            document.getElementById("coupenErorr").innerHTML = "Please enter a minimum purchase";
            return false;
        }

        if (startingdate === "") {
            document.getElementById("coupenErorr").innerHTML = "Please enter a starting date";
            return false;
        }

        if (expiredate === "") {
            document.getElementById("coupenErorr").innerHTML = "Please enter an expire date";
            return false;
        }

        if (status === "") {
            document.getElementById("coupenErorr").innerHTML = "Please enter a status";
            return false;
        }

        return true;
    }

