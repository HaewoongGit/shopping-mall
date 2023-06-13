# shopping-mall
쇼핑몰 프로젝트


### createProduct, updateProduct 뮤테이션 트랜잭션 처리
```
productCategory = await this.productCategoryService.create(
                    {
                        categoryName,
                    },
                    queryRunner
                );
                
const newTags = await this.productTagService.bulkInsert(
                {
                    names: temp,
                },
                queryRunner
            );
            
const result = await queryRunner.manager.save(Product, {
                ...product,
                user,
                productCategory,
                productTags: tags,
            });
```
상품 생성 및 변경 시 productCategory와 productTag도 함께 생성되거나 변경됩니다.
이때 상품 생성 트랜잭션을 적절히 처리하기 위해 생성 도중 오류가 나면 모두 productCategory와 productTag의 생성 또는 변경 작업도 모두 롤백되도록 구현하였습니다.
또한 "READ COMMITTED" 격리 수준을 적용하여 updateProduct 작업으로 상품 수정시 트랜잭션이 완전히 완료되지 않으면 중간 변경작업이 상품 데이터 조회시 조회되지 않도록 구현하였습니다.
