//order fetch

function status(id, productId) {
    console.log('iddddddddd', id);
    const statusElementId = `${id}${productId}`;
    const status = document.getElementById(statusElementId).value;
    console.log(status, 'statttttttttt');

    fetch('/admin/updatestatus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            newStatus: status,
            productId: productId,
        }),
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                console.log('sicces');
                $("#reloadDiv").load(`/admin/showorder?id=${id} #reloadDiv`);
            }
        })
        .catch(error => console.error('Error updating status:', error));
}


//delete offer fetch
function deleteOffer(id) {
    console.log(id);

    Swal.fire({
        title: 'Are you sure?',
        text: 'This Offer will be deleted',
        icon: 'question',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#1e6e2c',
        cancelButtonColor: '#97a399',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/admin/deleteoffer`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        Swal.fire('Success succes', 'successfully deleted offer.', 'success');
                        $("#reloadDiv").load("/admin/offer #reloadDiv");
                    } else {
                        Swal.fire('Error', 'Error deleting offer.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error deleting offer:', error);
                });
        } else {
            console.log('cancelled');
        }
    });
}


//coupen delete fetch

function deleteCoupon(id) {
    console.log(id);

    Swal.fire({
        title: 'Are you sure?',
        text: 'This coupon will be deleted',
        icon: 'question',
        reverseButtons: true,
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#1e6e2c',
        cancelButtonColor: '#97a399',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(`/admin/deletecoupon`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id }),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        $("#reloadDiv").load("/admin/coupon #reloadDiv");
                    } else {
                        Swal.fire('Error', 'Error deleting coupon.', 'error');
                    }
                })
                .catch(error => {
                    console.error('Error deleting coupon:', error);
                });
        } else {
            console.log('cancelled');
        }
    });
}


//add offer in product

    let productId;

    function passId(id) {
        console.log(id, 'idw');
        productId = id;
    }

    console.log(productId);

    function applyOffer(id) {
        console.log(productId);
        fetch(`/admin/applyoffer`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, productId: productId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                $('#offerModal').modal('hide');
                location.reload();
            } else {
                Swal.fire('Error', 'Error adding offer.', 'error');
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    function removeOffer(id) {
        console.log(id);
        fetch(`/admin/removeoffer`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                Swal.fire('Error', 'Error adding offer.', 'error');
            }
        })
        .catch(error => {
            console.log(error);
        });
    }




//category offer fetch

    let categoryId;

    function passCategoryId(id) {
        console.log(id, 'id');
        categoryId = id;
    }

    function applyCategoryOffer(id) {
        fetch(`/admin/applycategoryoffer`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id, categoryId: categoryId }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                $('#offerModal').modal('hide');
                location.reload();
            } else {
                Swal.fire('Error', 'Error adding offer.', 'error');
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    function removeCategoryOffer(id) {
        fetch(`/admin/removecategoryoffer`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: id }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                location.reload();
            } else {
                Swal.fire('Error', 'Error adding offer.', 'error');
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    